import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function useKeyPairSearchParams() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const entries = Array.from(searchParams.entries()).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );
    return entries;
  }, [searchParams]);
}
