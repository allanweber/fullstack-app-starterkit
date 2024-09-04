import { DataTable } from "@/components/data-table/data-table";
import { MessageDisplay } from "@/components/MessageDisplay";
import { Button } from "@/components/ui/button";
import useKeyPairSearchParams from "@/hooks/useKeyPairSearchParams";
import { Link } from "react-router-dom";
import { columnFilterSchema, columns } from "./columns";
import { filterFields } from "./filters";
import { transactions } from "./transactions-data";

export default function Transactions() {
  const entries = useKeyPairSearchParams();

  const search = columnFilterSchema.safeParse(entries);
  if (!search.success) {
    return (
      <div className="flex  flex-col items-center gap-4">
        <MessageDisplay message="Invalid search parameters" />
        <Button asChild className="w-full">
          <Link to="/app/transactions">Clear filters</Link>
        </Button>
      </div>
    );
  }

  const defaultColumnFilters = Object.entries(search.data).map(([key, value]) => ({
    id: key,
    value,
  }));

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Last Transactions</h1>

      <DataTable
        columns={columns}
        data={transactions}
        filterFields={filterFields}
        defaultColumnFilters={defaultColumnFilters}
        sortingState={[{ id: "date", desc: true }]}
      />
    </>
  );
}
