import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

export const useAuth = (): AuthContextType => {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      if (!token) return null;
      return await apiRequest('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    enabled: !!token,
    retry: false
  });

  // Login function
  const login = async (email: string, password: string) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setToken(response.token);
    
    // Invalidate queries to refetch user data
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    queryClient.removeQueries();
  };

  return {
    user: user?.user || null,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    token
  };
};