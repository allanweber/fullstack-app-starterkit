import useUpdateSearchParams from "@/hooks/use-update-search-params";
import type { Table } from "@tanstack/react-table";

import { InputWithAddons } from "@/components/ui/input-with-addons";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { DataTableInputFilterField } from "./types";

type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {
  table: Table<TData>;
};

export function DataTableFilterInput<TData>({
  table,
  value: _value,
}: DataTableFilterInputProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  const filters = typeof filterValue === "string" ? filterValue : "";

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={value} className="sr-only px-2 text-muted-foreground">
        {value}
      </Label>
      <InputWithAddons
        placeholder="Search"
        leading={<Search className="mt-0.5 h-4 w-4" />}
        containerClassName="h-9 rounded-lg"
        name={value}
        id={value}
        value={filters}
        onChange={(e) => {
          const val = e.target.value;
          const newValue = val.trim() === "" ? null : val;
          column?.setFilterValue(newValue);
          updateSearchParams({
            [value]: newValue,
          });
        }}
      />
      <p className="px-2 text-xs text-muted-foreground">Spaces are not allowed in this field.</p>
    </div>
  );
}