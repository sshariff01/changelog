-- Add email field to profiles table
ALTER TABLE profiles ADD COLUMN email TEXT;

-- Add a unique constraint on email to ensure no duplicates
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update the trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;