-- Let a signed-in traveller update only their own active booking. The trigger
-- below limits which fields a customer can change; admins retain full access.
CREATE POLICY "own active bookings update" ON public.bookings
FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND status IN ('pending', 'confirmed'))
WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'confirmed', 'cancelled'));

CREATE OR REPLACE FUNCTION public.protect_customer_booking_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF OLD.user_id <> auth.uid() THEN
      RAISE EXCEPTION 'You can only update your own bookings';
    END IF;

    IF OLD.status NOT IN ('pending', 'confirmed')
      OR NEW.status NOT IN (OLD.status, 'cancelled')
      OR NEW.package_id IS DISTINCT FROM OLD.package_id
      OR NEW.package_name IS DISTINCT FROM OLD.package_name
      OR NEW.destination IS DISTINCT FROM OLD.destination
      OR NEW.customer_email IS DISTINCT FROM OLD.customer_email
      OR NEW.travelers IS DISTINCT FROM OLD.travelers
      OR NEW.notes IS DISTINCT FROM OLD.notes
      OR NEW.total_amount_inr IS DISTINCT FROM OLD.total_amount_inr
      OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
      OR NEW.reference IS DISTINCT FROM OLD.reference
      OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'This booking change is not allowed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_customer_booking_updates
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.protect_customer_booking_updates();
