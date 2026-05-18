import { api } from '../../lib/axios';


export const createRoom = async (data) => {
    const token = localStorage.getItem('login');
  const res =  await api.post(
    `/admin/createRoom/${data.hostelId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getallRooms = async (hostelId) => {
  const token = localStorage.getItem('login');
  const res = await api.get(
    `/admin/getallrooms/${hostelId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
