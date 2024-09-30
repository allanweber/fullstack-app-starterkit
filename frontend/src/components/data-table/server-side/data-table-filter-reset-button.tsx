import useUpdateSearchParams from "@/hooks/use-update-search-params";

import { Button } from "@/components/ui/button";
import useNamedSearchParam from "@/hooks/useNamedSearchParam";
import { X } from "lucide-react";
import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
  type DataTableFilterField,
} from "../types";

type DataTableFilterResetButtonProps<TData> = DataTableFilterField<TData> & {};

export function DataTableFilterResetButton<TData>({
  value: _value,
}: DataTableFilterResetButtonProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();

  const searchParam = useNamedSearchParam(value);
  const filters = searchParam
    ? searchParam.includes(ARRAY_DELIMITER)
      ? searchParam.split(ARRAY_DELIMITER)
      : searchParam.includes(SLIDER_DELIMITER)
      ? searchParam.split(SLIDER_DELIMITER)
      : searchParam.includes(RANGE_DELIMITER)
      ? searchParam.split(RANGE_DELIMITER)
      : [searchParam]
    : [];

  if (!searchParam) return null;

  return (
    <Button
      variant="outline"
      className="h-5 rounded-full px-1.5 py-1 font-mono text-[10px]"
      onClick={(e) => {
        e.stopPropagation();
        updateSearchParams({ [value]: null });
      }}
      asChild
    >
      <div role="button">
        <span>{filters.length}</span>

        <X className="ml-1 h-2.5 w-2.5 text-muted-foreground" />
      </div>
    </Button>
  );
}
