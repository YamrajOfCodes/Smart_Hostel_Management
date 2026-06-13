import { api } from "../../lib/axios";

export const subscribePush = async (subscription) => {
    console.log(subscription)
  const token = localStorage.getItem("login");
  const res = await api.post(
    `/activity/subscribe`,
    subscription,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
 
export const unsubscribePush = async () => {
  const token = localStorage.getItem("login");
  const res = await api.delete(
    `/activity/unsubscribe`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};