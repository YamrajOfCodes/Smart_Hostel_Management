import { api } from "../../lib/axios";

export const updateResident = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/updateResident`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const deleteResident = async (data) => {
  const token = localStorage.getItem("login");

  const res = await api.delete("/admin/deleteResident", {
    data, // request body
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

