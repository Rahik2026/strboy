"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { generateId } from "@/lib/utils";

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

interface RegisterData {
  username: string;
  phone: string;
  password: string;
  email?: string;
  facebookId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sb_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const isAdmin = user?.role === "admin" || user?.email?.toLowerCase().includes("admin@starboybd.com");

  const login = async (phone: string, password: string) => {
    // Mock login — wire to Firebase Auth here
    const mockUser: UserProfile = {
      id: generateId(),
      username: phone.replace(/\+88/, ""),
      phone,
      role: phone.includes("admin") || password === "admin123" ? "admin" : "user",
      createdAt: new Date().toISOString(),
    };
    if (phone === "+8801" || password === "admin123") {
      mockUser.role = "admin";
      mockUser.username = "Starboy Admin";
      mockUser.email = "admin@starboybd.com";
    }
    setUser(mockUser);
    localStorage.setItem("sb_user", JSON.stringify(mockUser));
  };

  const register = async (data: RegisterData) => {
    const newUser: UserProfile = {
      id: generateId(),
      username: data.username,
      phone: data.phone,
      email: data.email,
      facebookId: data.facebookId,
      role: data.email?.toLowerCase() === "admin@starboybd.com" ? "admin" : "user",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("sb_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sb_user");
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("sb_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
