-- Add custom email verification fields to profiles
ALTER TABLE profiles
ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_sent_at TIMESTAMPTZ;