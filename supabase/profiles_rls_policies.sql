-- Enable Row Level Security (RLS) on the profiles table
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile"
ON profile
FOR INSERT
USING (auth.uid() = id);

-- Allow users to select their own profile
CREATE POLICY "Allow users to select their own profile"
ON profile
FOR SELECT
USING (auth.uid() = id);

-- (Optional) Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
ON profile
FOR UPDATE
USING (auth.uid() = id);

-- (Optional) Allow users to delete their own profile
CREATE POLICY "Allow users to delete their own profile"
ON profile
FOR DELETE
USING (auth.uid() = id);
