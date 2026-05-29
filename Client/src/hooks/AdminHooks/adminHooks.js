import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, getHostels, registerHostel,updateHostel,deleteHostel, getRooms, getHostelById, assignRoom, unassignRoom } from "../../types/Admin/adminAPI";
import toast from "react-hot-toast";





export const useRegisterHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerHostel,

    onSuccess: (_, variables) => {
      toast.success("hostel registered successfully");
      queryClient.invalidateQueries({ queryKey: ["hostel"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to register hostel room");
    }
  });
};



export const usegetHostels = (ownerId) => {
  return useQuery({
    queryKey: ["hostel", ownerId],
    queryFn: () => getHostels(ownerId).then((res) => res.data),
    enabled: !!ownerId,               
  });
};


export const useGetHosetlById = (hostelId) => {
  return useQuery({
    queryKey: ["hostel", hostelId],
    queryFn: () => getHostelById(hostelId).then((res) => res.data),
    enabled: !!hostelId,           
  });
};





export const useUpdateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHostel,

    onSuccess: (_, variables) => {
      toast.success("hostel updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hostel"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error("Failed to update hostel room");
    }
  });
};




export const usedeleteHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHostel,

    onSuccess: (_, variables) => {
      toast.success("hostel deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["hostel"] });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete hostel room");
    }
  });
};



// Room Hooks


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
      toast.error(error?.response?.data?.message  || "Something went wrong");
    }
  });
};


export const useGetRooms = (hostelId) => {
  return useQuery({
    queryKey: ["room", hostelId],
    queryFn: () => getRooms(hostelId).then((res) => res.getrooms),
    enabled: !!hostelId,           
  });
};


export const useAssignedRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRoom,

    onSuccess: (_, variables) => {
      toast.success("room assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error(error?.response?.data?.message  || "Something went wrong");
    }
  });
};


export const useUnAssignedRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unassignRoom,

    onSuccess: (_, variables) => {
      toast.success("room unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },

    onError: (error) => {
        console.log(error);
      toast.error(error?.response?.data?.message  || "Something went wrong");
    }
  });
};















