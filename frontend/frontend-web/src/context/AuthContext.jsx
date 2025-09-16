import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile to get role
      axios.get('auth/profile/', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data);
          setRole(res.data.role);
        })
        .catch(() => {
          setUser(null);
          setRole(null);
        });
    } else {
      setUser(null);
      setRole(null);
    }
  }, [token]);

  const login = async (username, password) => {
    // TODO: Call Django login API
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
