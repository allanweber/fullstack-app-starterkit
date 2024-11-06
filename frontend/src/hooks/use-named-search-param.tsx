import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function useNamedSearchParam(name: string) {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    return searchParams.get(name);
  }, [searchParams, name]);
}
