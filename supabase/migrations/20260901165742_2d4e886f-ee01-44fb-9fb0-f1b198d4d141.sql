-- ROLES
CREATE TYPE public.app_role AS ENUM ('user','admin');
CREATE TYPE public.pkg_category AS ENUM ('domestic','international');
CREATE TYPE public.pkg_status AS ENUM ('active','inactive','sold_out','draft');
CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','cancelled','completed');
CREATE TYPE public.payment_status AS ENUM ('unpaid','partial','paid','refunded');
CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected');

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  mobile TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.email,''), COALESCE(NEW.raw_user_meta_data->>'mobile',''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PACKAGES
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  category public.pkg_category NOT NULL DEFAULT 'domestic',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  days INT NOT NULL DEFAULT 1,
  nights INT NOT NULL DEFAULT 0,
  price_inr INT NOT NULL DEFAULT 0,
  max_travelers INT NOT NULL DEFAULT 12,
  locations_count INT NOT NULL DEFAULT 1,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.8,
  reviews_count INT NOT NULL DEFAULT 0,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  terms TEXT NOT NULL DEFAULT '',
  cancellation_policy TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status public.pkg_status NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX packages_category_idx ON public.packages(category);
CREATE INDEX packages_status_idx ON public.packages(status);
CREATE INDEX packages_destination_idx ON public.packages(destination);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public active packages" ON public.packages FOR SELECT TO anon, authenticated USING (status = 'active' AND deleted_at IS NULL);
CREATE POLICY "admin read packages" ON public.packages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write packages" ON public.packages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update packages" ON public.packages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete packages" ON public.packages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BOOKINGS
CREATE SEQUENCE public.booking_ref_seq START 124;
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id),
  package_name TEXT NOT NULL DEFAULT '',
  destination TEXT NOT NULL DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  travelers INT NOT NULL DEFAULT 1,
  travel_date DATE NOT NULL,
  special_requirements TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  total_amount_inr INT NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX bookings_user_idx ON public.bookings(user_id);
CREATE INDEX bookings_status_idx ON public.bookings(status);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookings read" ON public.bookings FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own bookings insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookings update" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.set_booking_reference() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'TRV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.booking_ref_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER bookings_reference BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_booking_reference();

-- SAVED PACKAGES
CREATE TABLE public.saved_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, package_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_packages TO authenticated;
GRANT ALL ON public.saved_packages TO service_role;
ALTER TABLE public.saved_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saved" ON public.saved_packages FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '',
  package_name TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 5,
  body TEXT NOT NULL DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
);
CREATE INDEX reviews_status_idx ON public.reviews(status);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approved reviews public" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "own reviews read" ON public.reviews FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own reviews insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "admin reviews update" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin reviews delete" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'email',
  recipient TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ADMIN LOGS
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_logs TO authenticated;
GRANT ALL ON public.admin_logs TO service_role;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin logs read" ON public.admin_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- SEED PACKAGES
INSERT INTO public.packages (code,name,destination,country,category,summary,description,cover_image,days,nights,price_inr,max_travelers,locations_count,rating,reviews_count,itinerary,inclusions,exclusions,terms,cancellation_policy,is_featured,status) VALUES
('PKG-1024','Kashmir Escape','Kashmir','India','domestic','Houseboats, Mughal gardens and alpine meadows across the valley.','A five-night drift through Srinagar, Pahalgam and Gulmarg — shikara mornings, meadow walks and walnut-lit dinners in heritage stays.','/images/kashmir.jpg',6,5,48500,12,3,4.9,312,
 '[{"day":1,"title":"Arrival in Srinagar","items":["Airport pickup","Houseboat check-in","Evening shikara ride on Dal Lake"]},{"day":2,"title":"Srinagar sightseeing","items":["Shalimar Bagh","Nishat Bagh","Old City bazaar walk"]},{"day":3,"title":"Gulmarg","items":["Gondola ride","Meadow lunch","Sunset drive back"]},{"day":4,"title":"Pahalgam","items":["Betaab Valley","Lidder river walk","Bonfire evening"]},{"day":5,"title":"Leisure day","items":["Local crafts tour","Saffron fields","Farewell dinner"]},{"day":6,"title":"Departure","items":["Souvenir stop","Airport transfer"]}]'::jsonb,
 '["Houseboat and hotel accommodation","Daily breakfast and dinner","Airport transfers","All sightseeing by private cab","Local English speaking guide"]'::jsonb,
 '["Flights","Personal expenses and tips","Travel insurance","Optional activities"]'::jsonb,
 'Valid ID proof required for all travellers. Itinerary may change due to weather or local conditions.','Free cancellation up to 21 days before departure. 50% refund up to 7 days. No refund thereafter.',true,'active'),
('PKG-1025','Kerala Backwater Retreat','Kerala','India','domestic','Paddy fields, Ayurveda and slow rivers in the deep south.','Alleppey houseboats, Munnar tea slopes and Fort Kochi evenings — a gentle, green week paced for rest.','/images/kerala.jpg',7,6,56900,10,4,4.8,244,
 '[{"day":1,"title":"Arrival in Kochi","items":["Airport pickup","Fort Kochi heritage walk","Kathakali performance"]},{"day":2,"title":"Munnar","items":["Drive through spice plantations","Tea museum","Sunset point"]},{"day":3,"title":"Munnar hills","items":["Eravikulam National Park","Mattupetty dam","Echo point"]},{"day":4,"title":"Thekkady","items":["Periyar boat safari","Spice garden tour"]},{"day":5,"title":"Alleppey","items":["Houseboat check-in","Backwater cruise","Onboard Kerala dinner"]},{"day":6,"title":"Ayurveda day","items":["Morning massage","Village cycling","Beach evening"]},{"day":7,"title":"Departure","items":["Transfer to Kochi airport"]}]'::jsonb,
 '["Hotel and houseboat stay","Daily breakfast","All transfers in AC vehicle","Sightseeing entry fees","Backwater cruise"]'::jsonb,
 '["Flights","Lunch and dinner unless specified","Ayurveda treatments beyond package","Personal expenses"]'::jsonb,
 'Houseboat cruising hours are regulated by local authorities.','Free cancellation up to 15 days before departure. 40% refund up to 5 days.',true,'active'),
('PKG-1026','Royal Rajasthan','Rajasthan','India','domestic','Forts, havelis and desert nights across the pink and blue cities.','Jaipur, Jodhpur and Jaisalmer stitched together with heritage stays, palace dinners and a night under desert stars.','/images/rajasthan.jpg',8,7,64200,14,4,4.7,198,
 '[{"day":1,"title":"Arrival in Jaipur","items":["Hotel check-in","Local bazaar evening"]},{"day":2,"title":"Jaipur","items":["Amber Fort","City Palace","Hawa Mahal","Jantar Mantar"]},{"day":3,"title":"Pushkar","items":["Brahma temple","Lake ghats","Camel ride"]},{"day":4,"title":"Jodhpur","items":["Mehrangarh Fort","Jaswant Thada","Blue city walk"]},{"day":5,"title":"Jaisalmer","items":["Golden fort","Patwon ki Haveli"]},{"day":6,"title":"Desert camp","items":["Sam dunes","Folk music evening","Overnight in luxury tents"]},{"day":7,"title":"Return to Jaipur","items":["Leisure morning","Scenic drive"]},{"day":8,"title":"Departure","items":["Airport transfer"]}]'::jsonb,
 '["Heritage hotel stays","Daily breakfast and dinner","Private AC vehicle","Monument entry fees","Desert camp with cultural evening"]'::jsonb,
 '["Flights","Camera fees","Personal shopping","Travel insurance"]'::jsonb,
 'Monument timings are subject to government notification.','Free cancellation up to 20 days before departure. 50% refund up to 10 days.',true,'active'),
('PKG-1027','Himachal Himalaya Trail','Himachal Pradesh','India','domestic','Pine valleys, snow plateaus and riverside cafes.','Shimla, Manali and Solang across six unhurried days of mountain air, cable cars and slow coffee.','/images/himachal.jpg',6,5,41800,16,3,4.8,176,
 '[{"day":1,"title":"Arrival in Shimla","items":["Mall Road walk","Ridge sunset"]},{"day":2,"title":"Kufri","items":["Himalayan nature park","Pony ride","Green valley viewpoint"]},{"day":3,"title":"Drive to Manali","items":["Kullu valley stop","River rafting option","Hotel check-in"]},{"day":4,"title":"Solang Valley","items":["Snow activities","Rohtang road drive","Cafe evening"]},{"day":5,"title":"Manali local","items":["Hadimba temple","Vashisht hot springs","Old Manali walk"]},{"day":6,"title":"Departure","items":["Transfer to Chandigarh or Delhi"]}]'::jsonb,
 '["Hotel accommodation","Daily breakfast","All transfers","Sightseeing as per itinerary"]'::jsonb,
 '["Flights and train fares","Adventure activity charges","Personal expenses"]'::jsonb,
 'Rohtang Pass access depends on permits and snow conditions.','Free cancellation up to 14 days before departure. 40% refund up to 5 days.',false,'active'),
('PKG-1028','Goa Coastal Break','Goa','India','domestic','Beach shacks, Portuguese lanes and sunset cruises.','North and South Goa in four easy days — Latin quarters, spice farms and long slow evenings by the sea.','/images/goa.jpg',4,3,24900,20,2,4.6,289,
 '[{"day":1,"title":"Arrival","items":["Resort check-in","Baga beach evening"]},{"day":2,"title":"North Goa","items":["Fort Aguada","Calangute and Candolim","Sunset cruise on Mandovi"]},{"day":3,"title":"South Goa","items":["Basilica of Bom Jesus","Spice plantation lunch","Palolem beach"]},{"day":4,"title":"Departure","items":["Leisure morning","Airport transfer"]}]'::jsonb,
 '["Beach resort stay","Daily breakfast","Airport transfers","North and South Goa sightseeing","Sunset cruise tickets"]'::jsonb,
 '["Flights","Water sports","Alcohol and personal expenses"]'::jsonb,
 'Water sports operate subject to weather clearance.','Free cancellation up to 10 days before departure. 30% refund up to 3 days.',false,'active'),
('PKG-2001','Dubai & the Dunes','Dubai','United Arab Emirates','international','Skyline nights, desert camp and old souq mornings.','Burj Khalifa sunsets, a dune-bashing desert safari and the quiet of the Deira creek in five polished days.','/images/dubai.jpg',5,4,72000,15,4,4.7,221,
 '[{"day":1,"title":"Arrival in Dubai","items":["Airport pickup","Hotel check-in","Marina walk"]},{"day":2,"title":"City tour","items":["Burj Khalifa 124th floor","Dubai Mall fountain show","Old souqs and abra ride"]},{"day":3,"title":"Desert safari","items":["Dune bashing","Camel ride","BBQ dinner with live show"]},{"day":4,"title":"Abu Dhabi day trip","items":["Sheikh Zayed Grand Mosque","Corniche drive"]},{"day":5,"title":"Departure","items":["Duty free shopping","Airport transfer"]}]'::jsonb,
 '["4 nights hotel stay","Daily breakfast","Visa assistance","All transfers and tours","Desert safari with dinner"]'::jsonb,
 '["International flights","Visa fees","Travel insurance","Meals not specified"]'::jsonb,
 'Passport must be valid for at least six months from travel date.','Free cancellation up to 25 days before departure. 50% refund up to 12 days.',true,'active'),
('PKG-2002','Bali Island Escape','Bali','Indonesia','international','Rice terraces, temple cliffs and volcanic sunrises.','Ubud jungle stays, Uluwatu cliffs and Nusa Penida beaches over seven island days.','/images/bali.jpg',7,6,84500,12,5,4.9,341,
 '[{"day":1,"title":"Arrival in Denpasar","items":["Airport pickup","Seminyak sunset"]},{"day":2,"title":"Ubud","items":["Tegalalang rice terrace","Monkey forest","Ubud art market"]},{"day":3,"title":"Volcano day","items":["Mount Batur viewpoint","Coffee plantation","Tirta Empul temple"]},{"day":4,"title":"Nusa Penida","items":["Kelingking beach","Angels Billabong","Broken beach"]},{"day":5,"title":"Uluwatu","items":["Temple cliff walk","Kecak fire dance","Jimbaran seafood dinner"]},{"day":6,"title":"Leisure","items":["Spa morning","Beach club afternoon"]},{"day":7,"title":"Departure","items":["Airport transfer"]}]'::jsonb,
 '["6 nights stay in Ubud and Seminyak","Daily breakfast","Private transfers","Nusa Penida day trip with ferry","Entry tickets"]'::jsonb,
 '["International flights","Visa on arrival fee","Lunch and dinner unless specified","Optional water sports"]'::jsonb,
 'Temple visits require modest dress; sarongs are provided at sites.','Free cancellation up to 25 days before departure. 45% refund up to 12 days.',true,'active'),
('PKG-2003','Maldives Water Villa','Maldives','Maldives','international','Overwater villas, reef snorkelling and endless blue.','Five nights on a private atoll with a water villa, house-reef snorkelling and a sunset dolphin cruise.','/images/maldives.jpg',5,4,132000,6,1,4.9,187,
 '[{"day":1,"title":"Arrival in Male","items":["Speedboat transfer","Water villa check-in","Sunset on the deck"]},{"day":2,"title":"Reef day","items":["House reef snorkelling","Kayaking","Beachside dinner"]},{"day":3,"title":"Ocean day","items":["Dolphin cruise","Sandbank picnic"]},{"day":4,"title":"Spa and leisure","items":["Overwater spa session","Night fishing"]},{"day":5,"title":"Departure","items":["Speedboat to Male airport"]}]'::jsonb,
 '["4 nights overwater villa","Breakfast and dinner","Speedboat transfers","Snorkelling gear","Dolphin cruise"]'::jsonb,
 '["International flights","Green tax where applicable","Premium beverages","Scuba diving"]'::jsonb,
 'Resort island rules apply; children policy varies by property.','Free cancellation up to 30 days before departure. 40% refund up to 15 days.',false,'active');
