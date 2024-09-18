import { DataTableFilterField, Option } from "@/components/data-table/types";
import { Color } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { ColumnSchema } from "./columns";
import { accounts, categories, TAGS, transactions } from "./transactions-data";

export const filterFields = [
  {
    label: "Account",
    value: "account",
    type: "checkbox",
    defaultOpen: true,
    options: accounts.map((account: string) => ({ label: account, value: account })),
  },
  {
    label: "Time Range",
    value: "date",
    type: "timerange",
    defaultOpen: true,
    commandDisabled: true,
  },
  {
    label: "Amount",
    value: "amount",
    type: "slider",
    min: 0,
    max: 3000,
    options: transactions.map(({ amount }) => ({ label: `${amount}`, value: amount })),
    defaultOpen: true,
    hint: "$",
  },
  {
    label: "Categories",
    value: "category",
    type: "checkbox",
    options: categories.map((ctg: string) => ({ label: ctg, value: ctg })),
    defaultOpen: true,
  },
  {
    label: "Type",
    value: "type",
    type: "checkbox",
    options: ["Expense", "Income"].map((type) => ({ label: `${type}`, value: type })),
    defaultOpen: true,
  },
  {
    label: "Description",
    value: "description",
    type: "input",
  },
  {
    label: "Tags",
    value: "tags",
    type: "checkbox",
    component: (props: Option) => {
      if (typeof props.value === "boolean") return null;
      if (typeof props.value === "undefined") return null;
      const color = TAGS.find((tag) => tag.tag === props.value)?.color || "gray";

      const colorClass = Color[color].dot;
      return (
        <div className="flex w-full items-center justify-between gap-3">
          <span className="truncate font-normal">{props.value}</span>
          <span className={cn("h-2 w-2 rounded-full", colorClass)} />
        </div>
      );
    },
    options: TAGS.map(({ tag }) => ({ label: tag, value: tag })),
  },
] satisfies DataTableFilterField<ColumnSchema>[];
