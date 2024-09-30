import useUpdateSearchParams from "@/hooks/use-update-search-params";

import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import useNamedSearchParam from "@/hooks/useNamedSearchParam";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { SetStateAction, useState } from "react";
import { InputWithAddons } from "../../ui/input-with-addons";
import { ARRAY_DELIMITER, type DataTableCheckboxFilterField } from "../types";

type DataTableFilterCheckboxProps<TData> = DataTableCheckboxFilterField<TData> & {};

export function DataTableFilterCheckbox<TData>({
  value: _value,
  options,
  component,
}: DataTableFilterCheckboxProps<TData>) {
  const value = _value as string;
  const [inputValue, setInputValue] = useState("");
  const updateSearchParams = useUpdateSearchParams();
  const searchParam = useNamedSearchParam(value);
  const searchParamArray = searchParam?.split(ARRAY_DELIMITER);

  if (!options?.length) return null;

  const filterOptions = options.filter(
    (option) => inputValue === "" || option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  const Component = component;

  return (
    <div className="grid gap-2">
      {options.length > 4 ? (
        <InputWithAddons
          placeholder="Search"
          leading={<Search className="mt-0.5 h-4 w-4" />}
          containerClassName="h-9 rounded-lg"
          value={inputValue}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setInputValue(e.target.value)
          }
        />
      ) : null}
      <div className="rounded-lg border border-border empty:border-none">
        {filterOptions.map((option, index) => {
          const checked =
            searchParamArray?.some((e: string) => {
              return e == (option.value as string);
            }) || false;

          return (
            <div
              key={String(option.value)}
              className={cn(
                "group relative flex items-center space-x-2 px-2 py-2.5 hover:bg-accent",
                index !== filterOptions.length - 1 ? "border-b" : undefined
              )}
            >
              <Checkbox
                id={`${value}-${option.value}`}
                checked={checked}
                onCheckedChange={(checked) => {
                  const update = checked
                    ? [...(searchParamArray || []), option.value]
                    : searchParamArray?.filter((value) => option.value != value);

                  updateSearchParams({
                    [value]: update?.length ? update.join(ARRAY_DELIMITER) : null,
                  });
                }}
              />
              <Label
                htmlFor={`${value}-${option.value}`}
                className="flex w-full gap-1 truncate text-muted-foreground group-hover:text-accent-foreground"
              >
                {Component ? (
                  <Component {...option} />
                ) : (
                  <span className="truncate font-normal">{option.label}</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    updateSearchParams({
                      [value]: `${option.value}`,
                    });
                  }}
                  className="absolute inset-y-0 right-0 hidden font-normal text-muted-foreground backdrop-blur-sm hover:text-foreground group-hover:block"
                >
                  <span className="px-2">only</span>
                </button>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
