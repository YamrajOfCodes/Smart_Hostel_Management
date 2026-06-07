import { api } from "../../lib/axios";


export const acceptNoticePeriod = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/accepted_noticeperiod`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}



export const rejectedNoticePeriod = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/rejected_noticeperiod`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}


export const getallNoticePeriod = async (hostelId) => {
  const token = localStorage.getItem('login');
  const res =  await api.get(
    `/admin/getallnoticeperiods/${hostelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};




export const clearNoticePeriod = async (data) => {
  const token = localStorage.getItem('login');
  const res =  await api.put(
    `/admin/clearnoticeperiod`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

