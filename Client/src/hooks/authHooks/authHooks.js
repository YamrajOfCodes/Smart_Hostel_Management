import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout } from "../../types/Auth/authAPI"
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';
import { AxiosError } from 'axios';
import { registerUser } from '../../types/Superadmin/superAdminAPI';



export const useRegister = ()=>{
  return useMutation({
    mutationFn: registerUser,
      onSuccess:()=>{
        toast.success("Admin registered successfully");
      },
      onError:(error)=>{
        const message = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Something went wrong";
       toast.error(message);
      }
  })
}

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const token = data.access_token;

      localStorage.setItem("login", token);

      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else if (decoded.role === "student") {
        navigate("/student");
      } else if (decoded.role === "superadmin") {
        navigate("/superadmin");
      } else {
        navigate("/");
      }

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      toast.success("Login successful");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    },
  });
};


export const useLogout = () => {
  const navigate = useNavigate(); 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      localStorage.removeItem('login');
      queryClient.invalidateQueries({ queryKey: ['me'] });

      toast.success('Logged out successfully');

      setTimeout(() => {
        navigate('/');
      }, 500);
    },

    onError: () => {
      toast.error('Error logging out. Please try again.');
    },
  });
};