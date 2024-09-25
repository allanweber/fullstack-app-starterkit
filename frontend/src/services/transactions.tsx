import { useAuth } from "@/hooks/useAuth";
import { Paginated } from "@/types/paginated";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { responseOrError } from "./response";

export const useTransactions = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`transactions`],
    queryFn: async (): Promise<Paginated<Transaction>> => {
      return fetch("/api/v1/transactions", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
