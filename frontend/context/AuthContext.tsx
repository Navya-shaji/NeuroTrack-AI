"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { logout as logoutAction } from "@/actions/auth";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      setUser(null);
      await logoutAction();
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
