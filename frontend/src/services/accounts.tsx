import { useAuth } from "@/hooks/useAuth";
import { Account } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { responseOrError } from "./response";

export const useAccounts = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`accounts`],
    queryFn: async (): Promise<Account[]> => {
      return fetch("/api/v1/accounts", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
