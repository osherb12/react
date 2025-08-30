// src/contexts/AuthContext.tsx
import {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../firebase";
import { AuthContext, type AuthUser } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const role = idTokenResult.claims.role as 'user' | 'business_owner' | 'admin' || 'user';
        console.log("User role from claims:", role);
        setUser(Object.assign(firebaseUser, { role }));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error("Error logging in:", error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error("Error logging out:", error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


