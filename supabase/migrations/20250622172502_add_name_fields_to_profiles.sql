-- Add first_name and last_name fields to profiles table
ALTER TABLE profiles ADD COLUMN first_name TEXT NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN last_name TEXT NOT NULL DEFAULT '';

-- Update the trigger function to include first_name, last_name, and username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;