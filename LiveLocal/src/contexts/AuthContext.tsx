// ============================================
// LiveLocal - Auth Context
// ============================================
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/users';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const login = (email: string, password: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password' };
    }
    if (found.isSuspended) {
      return { success: false, message: 'Your account has been suspended' };
    }
    setUser(found);
    return { success: true, message: 'Login successful' };
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      influencerStatus: role === 'influencer' ? 'pending' : undefined,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const deleteAccount = () => {
    if (!user) return;
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
