import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@medora.com',
    password: 'demo123',
    role: 'super_admin',
    avatar: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    email: 'doctor@medora.com',
    password: 'demo123',
    role: 'doctor',
    avatar: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    name: 'Nurse Mary Smith',
    email: 'nurse@medora.com',
    password: 'demo123',
    role: 'nurse',
    avatar: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'patient@medora.com',
    password: 'demo123',
    role: 'patient',
    avatar: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('medora_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email and role
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    // For demo purposes, accept any password for valid users
    if (foundUser && password) {
      setUser(foundUser);
      localStorage.setItem('medora_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medora_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};