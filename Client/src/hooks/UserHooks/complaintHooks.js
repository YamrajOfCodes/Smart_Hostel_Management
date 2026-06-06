import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { raiseComplaint,getComplaints,updateComplaint,deleteComplaint} from "../../types/User/complaintsAPI";
import toast from "react-hot-toast"

export const useRaiseComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: raiseComplaint,

    onSuccess: (_, variables) => {
      toast.success("complaint submited successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to submit notice");
    }
  });
};



export const usegetComplaints = (hostelId) => {
  return useQuery({
    queryKey: ["complaint", hostelId],
    queryFn: () => getComplaints(hostelId).then((res) => res.data),               
  });
};


export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:updateComplaint,

    onSuccess: (_, variables) => {
      toast.success("complaint updated successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to update complaint");
    }
  });
};




export const usedeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComplaint,

    onSuccess: (_, variables) => {
      toast.success("complaint deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["complaint"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete complaint");
    }
  });
};


