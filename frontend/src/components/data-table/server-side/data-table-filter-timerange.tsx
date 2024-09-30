import useUpdateSearchParams from "@/hooks/use-update-search-params";

import { useMemo } from "react";
import type { DateRange } from "react-day-picker";

import { DatePickerWithRange } from "../../date-picker-with-range";

import useNamedSearchParam from "@/hooks/useNamedSearchParam";
import { RANGE_DELIMITER, type DataTableTimerangeFilterField } from "../types";

type DataTableFilterTimerangeProps<TData> = DataTableTimerangeFilterField<TData> & {};

export function DataTableFilterTimeRange<TData>({
  value: _value,
}: DataTableFilterTimerangeProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const searchParam = useNamedSearchParam(value);
  const searchParamArray = searchParam?.split(RANGE_DELIMITER);

  const date: DateRange | undefined = useMemo(
    () =>
      searchParamArray instanceof Date
        ? { from: new Date(searchParamArray), to: undefined }
        : Array.isArray(searchParamArray) && searchParamArray.every((e) => !isNaN(Number(e)))
        ? {
            from: searchParamArray[0] ? new Date(Number(searchParamArray[0])) : undefined,
            to: searchParamArray[1] ? new Date(Number(searchParamArray[1])) : undefined,
          }
        : undefined,
    [searchParamArray]
  );

  const setDate = (date: DateRange | undefined) => {
    if (!date) return;
    if (date.from && !date.to) {
      updateSearchParams({ [value]: `${date.from.getTime()}` });
    }
    if (date.to && date.from) {
      updateSearchParams({
        [value]: [date.from.getTime(), date.to.getTime()].join(RANGE_DELIMITER),
      });
    }
  };

  return <DatePickerWithRange {...{ date, setDate }} />;
}
