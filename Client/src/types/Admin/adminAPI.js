import { api } from '../../lib/axios';



export const registerHostel = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.post(
    `/admin/registerHostel/${data.ownerId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};



export const getHostels = async (ownerId) => {
  const token = localStorage.getItem('login');
  const res =  await api.get(
    `/admin/getHostels/${ownerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const getHostelById  = async (hostelId) => {
  const token = localStorage.getItem('login');
  const res =  await api.get(
    `/admin/getIndividualHostel/${hostelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};




export const updateHostel = async ({data:updatedData,editId}=data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/updateHostel/${editId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const deleteHostel = async (hostelId) => {
  const token = localStorage.getItem('login');
  const res =  await api.delete(
    `/admin/deleteHostel/${hostelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};




// Room API


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


export const getRooms = async (hostelId) => {
  const token = localStorage.getItem('login');
  const res =  await api.get(
    `/admin/getallrooms/${hostelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};



