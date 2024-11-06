import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function usePaginationSearchParams() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const pagination = {
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 15,
      sortBy: searchParams.get("sortBy") || undefined,
      sortDirection: searchParams.get("sortDirection") || undefined,
    };

    return pagination;
  }, [searchParams]);
}
