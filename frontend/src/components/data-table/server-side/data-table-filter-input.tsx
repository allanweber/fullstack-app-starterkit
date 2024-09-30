import { InputWithAddons } from "@/components/ui/input-with-addons";
import { Label } from "@/components/ui/label";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import useNamedSearchParam from "@/hooks/useNamedSearchParam";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { DataTableInputFilterField } from "../types";

type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {};

export function DataTableFilterInput<TData>({ value: _value }: DataTableFilterInputProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const searchParam = useNamedSearchParam(value);
  const [content, setContent] = useState(searchParam);

  const onChangeInput = (val: string) => {
    const newValue = val.trim() === "" ? null : val;
    setContent(newValue);
  };

  useEffect(() => {
    setContent(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      updateSearchParams({
        [value]: content,
      });
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

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
        value={content || ""}
        onChange={(e) => onChangeInput(e.target.value)}
      />
      <p className="px-2 text-xs text-muted-foreground">Spaces are not allowed in this field.</p>
    </div>
  );
}
