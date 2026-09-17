-- Remove the traveller-review feature and its database objects.
DROP TABLE IF EXISTS public.reviews;
DROP TYPE IF EXISTS public.review_status;
ALTER TABLE public.packages DROP COLUMN IF EXISTS reviews_count;
