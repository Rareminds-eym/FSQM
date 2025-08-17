-- Fix for individual_attempts unique constraint error
-- This removes the unique constraint on email field to allow multiple attempts per email

-- Drop the unique constraint on email field
ALTER TABLE public.individual_attempts 
DROP CONSTRAINT IF EXISTS individual_attempts_email_key;

-- Verify the constraint has been removed
\d individual_attempts;