import { api } from "../../lib/axios";

export const submitNoticePeriod = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.post(
    `/user/submitnoticeperiod`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const getMyNoticePeriod = async (email) => {
  const token = localStorage.getItem("login");

  const res = await api.get(`/user/getmynoticeperiod/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const withDrawNoticePeriod = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/user/withdrawnoticeperiod`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

