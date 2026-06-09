import { api } from "../../lib/axios";

export const raiseComplaint = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.post(
    `/user/raisecomplaint/${data.hostelId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const getComplaints = async (hostelId) => {
  const token = localStorage.getItem("login");

  const res = await api.get(`/user/getallcomplaints/${hostelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const updateComplaint = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/updatecomplaint/${data.complaintId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteComplaint = async (complaintId) => {
  const token = localStorage.getItem('login');
  const res =  await api.delete(
    `/user/deletecomplaint/${complaintId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

