import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



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
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('medora_user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    setLoading(false);
    return false;
  };

  const register = async (userData: { name: string; email: string; password: string; role: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          isActive: true
        }),
      });
      
      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        localStorage.setItem('medora_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      register,
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