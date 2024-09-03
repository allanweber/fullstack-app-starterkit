import * as React from "react";
import { useSearchParams } from "react-router-dom";

export default function useUpdateSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get a new searchParams string by merging the current searchParams with a provided key/value pair.
   * If param is `null`, will be deleted.
   */
  const update = React.useCallback(
    (params: Record<string, unknown>, opts?: { override: boolean }) => {
      const newSearchParams = new URLSearchParams(opts?.override ? undefined : searchParams);

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          if (Array.isArray(value)) {
            newSearchParams.delete(key);
            for (const v of value) {
              // REMINDER: cant pass an array directly but can use several time `append`
              newSearchParams.append(key, String(v));
            }
          } else {
            // REMINDER: .set will automatically encodeURIComponent
            newSearchParams.set(key, String(value));
          }
        }
      }

      setSearchParams(newSearchParams);
      return newSearchParams.toString();
    },
    [searchParams, setSearchParams]
  );

  return update;
}
