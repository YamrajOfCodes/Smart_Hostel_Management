import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "../../types/Superadmin/superAdminAPI";



export const useGetAdmins = () => {
  return useQuery({
    queryKey:["admin"],
    queryFn: () => getAllAdmins().then((res) => res),
  });
};
