"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void; // Deprecated, kept for compatibility but will redirect
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const user = session?.user ? {
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || "",
    role: (session.user as any).role
  } : null;

  const login = (email: string) => {
    // Determine if this is needed. Login page calls this.
    // If we are refactoring Login page to use signIn directly, this might not be called there.
    // But keeping it safe:
    router.push("/login"); 
  };

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading"
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
