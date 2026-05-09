import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, getMe } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Token inválido o expirado', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const register = async (username, email, password) => {
    const data = await registerService(username, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
