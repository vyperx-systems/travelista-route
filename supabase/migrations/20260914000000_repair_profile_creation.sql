-- Keep application-owned identity data in public while Supabase Auth owns credentials.
-- This migration repairs the legacy text-ID schema currently present in the connected project.

-- A phone number is an identifier, not a number: it may contain a country code,
-- formatting, or leading zeroes.
ALTER TABLE public.profiles
  ALTER COLUMN mobile TYPE text USING mobile::text,
  ALTER COLUMN mobile SET DEFAULT '';

-- The existing project stores role records with text IDs. Ensure inserts made by
-- the trigger and database administrators receive an ID automatically.
ALTER TABLE public.user_roles
  ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- Keep the RLS comparisons valid whether a legacy public ID column is text or
-- a fresh deployment uses UUID. auth.uid() is always a UUID.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id::text = _user_id::text
      AND role = _role
  );
$$;

DROP POLICY IF EXISTS "own profile read" ON public.profiles;
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
DROP POLICY IF EXISTS "own profile update" ON public.profiles;
DROP POLICY IF EXISTS "roles read" ON public.user_roles;

CREATE POLICY "own profile read" ON public.profiles
  FOR SELECT TO authenticated
  USING (id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "own profile insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY "own profile update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "roles read" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

-- This function runs inside the same transaction as the Auth user insertion.
-- Any failure rejects the signup, preventing orphaned auth accounts.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'mobile', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Every account starts as a standard user. Only a database administrator or
  -- service-role server action may subsequently grant the admin role.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id::text, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Repair accounts created while the trigger was missing or failing.
INSERT INTO public.profiles (id, full_name, email, mobile)
SELECT
  u.id::text,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data ->> 'mobile', '')
FROM auth.users AS u
LEFT JOIN public.profiles AS p ON p.id::text = u.id::text
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id::text, 'user'
FROM auth.users AS u
LEFT JOIN public.user_roles AS r
  ON r.user_id::text = u.id::text
 AND r.role = 'user'
WHERE r.user_id IS NULL;

-- Role assignments are deliberately not writable by ordinary application users.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;