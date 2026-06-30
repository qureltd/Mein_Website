-- Add image_url to shop_drops for drop hero/banner image support.
ALTER TABLE public.shop_drops ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Extend SELECT grants to include the new column for both public and admin access.
GRANT SELECT (image_url) ON public.shop_drops TO anon;
GRANT SELECT (image_url) ON public.shop_drops TO authenticated;
