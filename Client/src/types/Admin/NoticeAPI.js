import { api } from "../../lib/axios";

export const publishNotice = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.post(
    `/admin/createnotice/${data.hostelId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const getNotices = async (hostelId) => {
  const token = localStorage.getItem("login");

  const res = await api.get(`/admin/getnotices/${hostelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const updateNotice = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/updatenotice/${data.noticeId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteNotice = async (noticeId) => {
  const token = localStorage.getItem('login');
  const res =  await api.delete(
    `/admin/deletenotice/${noticeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

