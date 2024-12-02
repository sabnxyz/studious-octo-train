import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  const data = useQuery<{
    email: string | null;
    github_id: string;
    id: string;
    name: string;
    profile_image: string;
  }>({
    queryKey: ["/api/auth"],
    queryFn: async () => {
      return (
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
          withCredentials: true,
        })
      ).data?.data;
    },
  });

  return data;
};
