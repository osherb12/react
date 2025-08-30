import { createContext } from "react";
import { type User as FirebaseUser } from "firebase/auth";

export interface AuthUser extends FirebaseUser {
  role?: 'user' | 'business_owner' | 'admin';
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
