import useUpdateSearchParams from "@/hooks/use-update-search-params";
import type { Table } from "@tanstack/react-table";

import { InputWithAddons } from "@/components/ui/input-with-addons";
import { Label } from "@/components/ui/label";
import { SLIDER_DELIMITER, type DataTableSliderFilterField } from "./types";

import { isArrayOfNumbers } from "@/lib/utils";
import { Slider } from "../ui/slider";

type DataTableFilterSliderProps<TData> = DataTableSliderFilterField<TData> & {
  table: Table<TData>;
};

// TBD: add debounce to reduce to number of filters
// TODO: extract onChange

export function DataTableFilterSlider<TData>({
  table,
  value: _value,
  min,
  max,
  hint = "",
}: DataTableFilterSliderProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  const filters =
    typeof filterValue === "number"
      ? [filterValue, filterValue]
      : Array.isArray(filterValue) && isArrayOfNumbers(filterValue)
      ? filterValue
      : undefined;

  return (
    <div className="grid gap-3 mb-2">
      <div className="flex items-center gap-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor={`min-${value}`} className="px-2 text-muted-foreground">
            Min.
          </Label>
          <InputWithAddons
            placeholder="from"
            leading={hint}
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`min-${value}`}
            id={`min-${value}`}
            value={`${filters?.[0] ?? min}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(filters) && val < filters[1] ? [val, filters[1]] : [val, max];
              column?.setFilterValue(newValue);
              updateSearchParams({
                [value]: newValue.join(SLIDER_DELIMITER),
              });
            }}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor={`max-${value}`} className="px-2 text-muted-foreground">
            Max.
          </Label>
          <InputWithAddons
            placeholder="to"
            leading={hint}
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`max-${value}`}
            id={`max-${value}`}
            value={`${filters?.[1] ?? max}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(filters) && val > filters[0] ? [filters[0], val] : [min, val];
              column?.setFilterValue(newValue);
              updateSearchParams({
                [value]: newValue.join(SLIDER_DELIMITER),
              });
            }}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={filters || [min, max]}
        onValueChange={(values) => {
          column?.setFilterValue(values);
          updateSearchParams({
            [value]: values.join(SLIDER_DELIMITER),
          });
        }}
      />
    </div>
  );
}
