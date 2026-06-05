import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNotice, getNotices, publishNotice, updateNotice } from "../../types/Admin/NoticeAPI";
import toast from "react-hot-toast"

export const usePublishNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishNotice,

    onSuccess: (_, variables) => {
      toast.success("notice published successfully");
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to publish notice");
    }
  });
};



export const usegetNotices = (hostelId) => {
  return useQuery({
    queryKey: ["notice", hostelId],
    queryFn: () => getNotices(hostelId).then((res) => res),               
  });
};


export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotice,

    onSuccess: (_, variables) => {
      toast.success("notice updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to update notice");
    }
  });
};




export const usedeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotice,

    onSuccess: (_, variables) => {
      toast.success("notice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete notice");
    }
  });
};


