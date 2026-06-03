import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResident, updateResident } from "../../types/Admin/ResidentAPI";
import toast from "react-hot-toast";

export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResident,

    onSuccess: (_, variables) => {
      toast.success("Resident updated successfully");
      queryClient.invalidateQueries({ queryKey: ["RESIDENTS"] });
    },

    onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data?.message  || "Something went wrong");
    }
  });
};


export const useDeleteResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResident,

    onSuccess: (_, variables) => {
      toast.success("Resident deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["RESIDENTS"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error(error?.response?.data?.message  || "Something went wrong");
    }
  });
};



