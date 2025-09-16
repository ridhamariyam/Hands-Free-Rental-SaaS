import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any;
  token: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // Fetch user profile to get role
        try {
          const res = await axios.get('auth/profile/', { headers: { Authorization: `Bearer ${storedToken}` } });
          setUser(res.data);
          setRole(res.data.role);
        } catch {
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    // TODO: Call Django login API and fetch role
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setRole(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
