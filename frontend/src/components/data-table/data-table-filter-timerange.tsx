import useUpdateSearchParams from "@/hooks/use-update-search-params";
import type { Table } from "@tanstack/react-table";

import { useMemo } from "react";
import type { DateRange } from "react-day-picker";

import { DatePickerWithRange } from "../date-picker-with-range";

import { isArrayOfDates } from "@/lib/utils";
import { RANGE_DELIMITER, type DataTableTimerangeFilterField } from "./types";

type DataTableFilterTimerangeProps<TData> = DataTableTimerangeFilterField<TData> & {
  table: Table<TData>;
};

// TBD: add debounce to reduce to number of filters
// TODO: extract onChange

export function DataTableFilterTimeRange<TData>({
  table,
  value: _value,
}: DataTableFilterTimerangeProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  const date: DateRange | undefined = useMemo(
    () =>
      filterValue instanceof Date
        ? { from: filterValue, to: undefined }
        : Array.isArray(filterValue) && isArrayOfDates(filterValue)
        ? { from: filterValue[0], to: filterValue[1] }
        : undefined,
    [filterValue]
  );

  const setDate = (date: DateRange | undefined) => {
    if (!date) return;
    if (date.from && !date.to) {
      column?.setFilterValue(date.from);
      updateSearchParams({ [value]: `${date.from.getTime()}` });
    }
    if (date.to && date.from) {
      column?.setFilterValue([date.from, date.to]);
      updateSearchParams({
        [value]: [date.from.getTime(), date.to.getTime()].join(RANGE_DELIMITER),
      });
    }
  };

  return <DatePickerWithRange {...{ date, setDate }} />;
}
