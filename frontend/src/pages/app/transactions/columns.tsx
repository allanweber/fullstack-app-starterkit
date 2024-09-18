import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ARRAY_DELIMITER, RANGE_DELIMITER, SLIDER_DELIMITER } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Color } from "@/lib/colors";
import { isArrayOfDates, isArrayOfNumbers } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format, isSameDay } from "date-fns";
import { CircleMinus, CirclePlus, Minus } from "lucide-react";
import { z } from "zod";
import { categories, TAGS } from "./transactions-data";

export const columnSchema = z.object({
  id: z.string(),
  account: z.string(),
  date: z.number(),
  amount: z.number(),
  category: z.string(),
  type: z.string(),
  description: z.string().optional(),
  tags: z.string().array(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

export const columns: ColumnDef<ColumnSchema>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const value = new Date(row.getValue("date"));
      return (
        <div className="text-xs text-muted-foreground">
          {format(new Date(`${value}`), "LLL dd, y")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      let rowValue = row.getValue(id);
      if (typeof rowValue === "number") rowValue = new Date(rowValue);
      if (value instanceof Date && rowValue instanceof Date) {
        return isSameDay(value, rowValue);
      }
      if (Array.isArray(value)) {
        if (isArrayOfDates(value) && rowValue instanceof Date) {
          const sorted = value.sort((a, b) => a.getTime() - b.getTime());
          return (
            sorted[0].getTime() <= rowValue.getTime() && rowValue.getTime() <= sorted[1].getTime()
          );
        }
      }
      return false;
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      const value = row.getValue("account");
      return <div className="max-w-[200px] truncate">{`${value}`}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const value = row.getValue("amount");
      if (typeof value === "undefined") {
        return <Minus className="h-4 w-4 text-muted-foreground/50" />;
      }
      return (
        <div>
          <span className="font-mono">{`${value}`}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as number;
      if (typeof value === "number") return value === Number(rowValue);
      if (Array.isArray(value) && isArrayOfNumbers(value)) {
        const sorted = value.sort((a, b) => a - b);
        return sorted[0] <= rowValue && rowValue <= sorted[1];
      }
      return false;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const value = row.getValue("category");
      return <div className="max-w-[200px] truncate">{`${value}`}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const value = row.getValue("type");
      return (
        <Tooltip key={row.id}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {value === "Expense" ? (
                <CircleMinus className="h-4 w-4 text-red-500" />
              ) : (
                <CirclePlus className="h-4 w-4 text-green-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">{`${value}`}</TooltipContent>
        </Tooltip>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      if (typeof value === "string") return value === String(rowValue);
      if (typeof value === "boolean") return value === rowValue;
      if (Array.isArray(value)) return value.includes(rowValue);
      return false;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const value = row.getValue("description");
      return <div className="max-w-[200px] truncate">{`${value}`}</div>;
    },
    filterFn: (row, id, value) => {
      if (typeof value === "undefined" || value === null) return true;
      const rowValue = row.getValue(id) as string;
      if (typeof value === "string") return rowValue.toLowerCase().includes(value.toLowerCase());
      return false;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const value = row.getValue("tags") as string | string[];
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => {
              const color = TAGS.find((tag) => tag.tag === v)?.color || "green";
              const colorClass = Color[color].badge;
              return (
                <Badge key={v} className={colorClass}>
                  {v}
                </Badge>
              );
            })}
          </div>
        );
      }
      const color = TAGS.find((tag) => tag.tag === value)?.color || "gray";
      return (
        <Badge
          style={{
            backgroundColor: `${color}`,
            borderColor: `${color}`,
            color: `white`,
          }}
        >
          {value}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const array = row.getValue(id) as string[];
      if (typeof value === "string") return array.includes(value);
      if (Array.isArray(value)) return value.some((i) => array.includes(i));
      return false;
    },
  },
];

export const columnFilterSchema = z.object({
  date: z.coerce
    .number()
    .pipe(z.coerce.date())
    .or(
      z
        .string()
        .transform((val) => val.split(RANGE_DELIMITER).map(Number))
        .pipe(z.coerce.date().array())
    )
    .optional(),
  amount: z.coerce
    .number()
    .or(
      z
        .string()
        .transform((val) => val.split(SLIDER_DELIMITER))
        .pipe(z.coerce.number().array().length(2))
    )
    .optional(),
  category: z
    .string()
    .refine((value) => categories.includes(value))
    .optional()
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .refine((value) => value.every((v) => categories.includes(v)))
        .pipe(z.array(z.string()))
    )
    .optional(),
  tags: z
    .string()
    .refine((value) => TAGS.map((t) => t.tag).includes(value))
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .refine((value) => value.every((v) => TAGS.map((t) => t.tag).includes(v)))
        .pipe(z.array(z.string()))
    )
    .optional(),
  description: z.string().optional(),
  type: z
    .string()
    .refine((value) => ["Expense", "Income"].includes(value))
    .optional(),
});
