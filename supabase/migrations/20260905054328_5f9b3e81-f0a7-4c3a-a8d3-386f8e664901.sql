CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.email,''), COALESCE(NEW.raw_user_meta_data->>'mobile',''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'user') ON CONFLICT DO NOTHING;
  IF lower(COALESCE(NEW.email,'')) = 'radarshim04@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE lower(email) = 'radarshim04@gmail.com'
ON CONFLICT DO NOTHING;