import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitNoticePeriod,getMyNoticePeriod,withDrawNoticePeriod} from "../../types/User/noticePeriodAPI";
import toast from "react-hot-toast"
import { clearNoticePeriod, getallNoticePeriod } from "../../types/Admin/noticePeriodAPI";

export const useSubmitNoticePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitNoticePeriod,

    onSuccess: (_, variables) => {
      toast.success("notice period generated successfully");
      queryClient.invalidateQueries({ queryKey: ["noticeperiod"] });
    },

    onError: (error) => {
    console.log(error);
    toast.error("Failed to submit notice");
    }
  });
};


export const useGetMyNoticePeriod = (email) => {
  return useQuery({
    queryKey: ["noticeperiod", email],
    queryFn: () => getMyNoticePeriod(email).then((res) => res.data),               
  });
};


export const useWithdrawNoticePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withDrawNoticePeriod,

    onSuccess: (_, variables) => {
      toast.success("notice period withdrawn successfully");
      queryClient.invalidateQueries({ queryKey: ["noticeperiod"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to withdraw noticePeriod");
    }
  });
};





