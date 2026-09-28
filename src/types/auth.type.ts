export type UserRole = "CUSTOMER" | "COURIER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  needPasswordChange: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  imageUrl?: string;
  authProvider?: string;
  createdAt?: string;
  customer?: {
    id: string;
    contactNumber?: string | null;
    address?: string | null;
    city?: string | null;
  } | null;
  courier?: {
    id: string;
    contactNumber?: string | null;
    vehicleType?: string;
    vehicleNumber?: string;
    availability?: boolean;
    currentCity?: string | null;
  } | null;
}
