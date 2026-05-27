import { api } from '../../lib/axios';


export const registerUser = async (data) => {
  const res = await api.post('/auth/insertUser', data);
  return res.data;
};

export const getAllAdmins = async () => {
  const token = localStorage.getItem('login');

  if (!token) {
    throw new Error('Authentication token is missing');
  }
  const res = await api.get('/superadmin/getallAdmins', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

