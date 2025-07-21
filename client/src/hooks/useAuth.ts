import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const token = localStorage.getItem('aywa_token');
      if (!token) {
        throw new Error('No token found');
      }
      
      return await apiRequest('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('aywa_token');
      queryClient.clear();
    },
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isPartner: user?.role === 'partner',
    isAdmin: user?.role === 'admin' || user?.role === 'manager',
    logout,
    error,
  };
}