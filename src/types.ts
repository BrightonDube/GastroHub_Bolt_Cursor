export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  profile: Profile | null;
}
