import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout } from "../../types/Auth/authAPI"

import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';


// hello

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const token = data.access_token;
      localStorage.setItem('login', token);

      const decoded = jwtDecode(token);

      if (decoded.role === 'ADMIN') {
        router.push('/admin');
      } else if (decoded.role === 'EMPLOYEE') {
        router.push('/employee');
      } else if (decoded.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Login successful');
    },

    onError: (error) => {
      const message = error.response?.data?.message ?? 'Something went wrong';

      if (error.response?.status === 401) {
        toast.error(message || 'Invalid email or password');
      } else {
        toast.error(message);
      }
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem('login');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Logged out successfully');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    },
    onError: () => {
      toast.error('Error logging out. Please try again.');
    },
  });
};
