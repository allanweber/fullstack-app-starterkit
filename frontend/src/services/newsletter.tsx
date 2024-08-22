import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { responseOrError } from "./response";

export const useQueryNewsletters = () => {
  const { getToken } = useAuth();
  const token = getToken();
  return useQuery({
    queryKey: ["newsletter"],
    queryFn: async () => {
      return fetch("/api/v1/newsletter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(responseOrError);
    },
  });
};
