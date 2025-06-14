/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add INSERT policy for profiles table to allow users to create their own profile during registration
    - Policy allows INSERT operations where the user ID matches the authenticated user ID

  This fixes the RLS violation error that occurs during user registration when trying to insert a new profile.
*/

-- Add INSERT policy for profiles table to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);