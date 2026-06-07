import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptNoticePeriod, clearNoticePeriod, getallNoticePeriod, rejectedNoticePeriod } from "../../types/Admin/noticePeriodAPI";


export const useGetAllNoticesForHostel = (hostelId) => {
  return useQuery({
    queryKey: ["noticeperiod", hostelId],
    queryFn: () => getallNoticePeriod(hostelId).then((res) => res.data),               
  });
};


export const useClearNoticePeriod = ()=>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearNoticePeriod,

    onSuccess: (_, variables) => {
      toast.success("notice period cleared successfully");
      queryClient.invalidateQueries({ queryKey: ["noticeperiod"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to clear noticePeriod");
    }
  });
}

export const useAcceptNoticePeriod = ()=>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptNoticePeriod,

    onSuccess: (_, variables) => {
      toast.success("notice period cleared successfully");
      queryClient.invalidateQueries({ queryKey: ["noticeperiod"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to clear noticePeriod");
    }
  });
}



export const useRejectNoticePeriod = ()=>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectedNoticePeriod,

    onSuccess: (_, variables) => {
      toast.success("notice period cleared successfully");
      queryClient.invalidateQueries({ queryKey: ["noticeperiod"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to clear noticePeriod");
    }
  });
}
