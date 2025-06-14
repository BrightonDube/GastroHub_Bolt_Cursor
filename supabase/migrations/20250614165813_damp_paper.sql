/*
  # Fix profiles table RLS policies for user registration

  1. Security Updates
    - Drop existing conflicting policies on profiles table
    - Create proper RLS policies that allow profile creation during registration
    - Ensure authenticated users can manage their own profiles
    - Allow public read access for verified suppliers

  2. Policy Changes
    - Allow users to insert their own profile during registration
    - Allow users to read and update their own profile data
    - Allow public read access to verified supplier profiles
*/

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "New User" ON profiles;
DROP POLICY IF EXISTS "Public profiles for suppliers" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new comprehensive policies for profiles table

-- Allow users to insert their own profile (works for both authenticated and during sign-up)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public read access to verified supplier profiles
CREATE POLICY "Public can read verified supplier profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (role = 'supplier' AND is_verified = true);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);