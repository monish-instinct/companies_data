-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label TEXT NOT NULL, -- 'home', 'work', 'other'
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS policies for addresses
CREATE POLICY "Users can view their own addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add preferences to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS style_preferences JSONB DEFAULT '{"categories": [], "brands": [], "sizes": {}}'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create function to ensure only one default address per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default = true THEN
    -- Set all other addresses for this user to non-default
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_single_default_address_trigger
BEFORE INSERT OR UPDATE ON public.addresses
FOR EACH ROW
WHEN (NEW.is_default = true)
EXECUTE FUNCTION public.ensure_single_default_address();