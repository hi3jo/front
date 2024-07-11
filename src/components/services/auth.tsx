import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; nickname: string; role: string } | null;
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
  const [user, setUser] = useState<{ id: string; nickname: string; role: string } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const nickname = localStorage.getItem('nickname');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (id && nickname && role && token) {
      setUser({ id, nickname, role });
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: { userid: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      if (response.status === 200 && response.data.token) {
        const userResponse = await axios.get('http://localhost:8080/api/user/me', {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        const userData = userResponse.data;
        setIsAuthenticated(true);
        setUser({ id: userData.id, nickname: userData.nickname, role: userData.role });
        localStorage.setItem('id', userData.id);
        localStorage.setItem('nickname', userData.nickname);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('token', response.data.token);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('id');
        localStorage.removeItem('nickname');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        throw new Error('Invalid login response');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('id');
      localStorage.removeItem('nickname');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      throw new Error('로그인 실패');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('id');
    localStorage.removeItem('nickname');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
