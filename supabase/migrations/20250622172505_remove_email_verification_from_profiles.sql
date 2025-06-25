-- Remove custom email verification fields from profiles
ALTER TABLE profiles
DROP COLUMN IF EXISTS is_email_verified,
DROP COLUMN IF EXISTS verification_token,
DROP COLUMN IF EXISTS verification_sent_at;