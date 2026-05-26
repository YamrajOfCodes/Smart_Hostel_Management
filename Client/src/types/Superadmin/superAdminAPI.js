import { api } from '../../lib/axios';


export const registerUser = async (data) => {
  const res = await api.post('/auth/insertUser', data);
  return res.data;
};

