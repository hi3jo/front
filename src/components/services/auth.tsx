import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { userid: string; nickname: string } | null;
  login: (credentials: { userid: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ userid: string; nickname: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (credentials: { userid: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      if (response.status === 200 && response.data.token) {
        setIsAuthenticated(true);
        setUser({ userid: credentials.userid, nickname: '' });
        localStorage.setItem('user', JSON.stringify({ userid: credentials.userid, nickname: '' }));
        localStorage.setItem('token', response.data.token);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        throw new Error('Invalid login response');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      throw new Error('로그인 실패');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
