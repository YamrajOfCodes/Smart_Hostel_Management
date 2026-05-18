import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, getallRooms } from "../../types/Admin/adminAPI";
import toast from "react-hot-toast";



export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,

    onSuccess: (_, variables) => {
      toast.success("room created successfully");
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to create room");
    }
  });
};


export const useGetRooms = (hostelId) => {
  return useQuery({
    queryKey: ["rooms", hostelId],
    queryFn: () => getallRooms(hostelId).then((res) => res.getrooms),
    enabled: !!hostelId,           // ✅ don't fire if hostelId is undefined    
  });
};

