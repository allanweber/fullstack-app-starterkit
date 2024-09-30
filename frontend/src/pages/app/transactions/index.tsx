import { DataTable } from "@/components/data-table/server-side/data-table";
import { MessageDisplay } from "@/components/MessageDisplay";
import useKeyPairSearchParams from "@/hooks/useKeyPairSearchParams";
import { useAccounts } from "@/services/accounts";
import { useCategories } from "@/services/categories";
import { useTags } from "@/services/tags";
import { useTransactions } from "@/services/transactions";
import { columnFilterSchema, columns } from "./columns";
import { filterFields } from "./filters";

export default function Transactions() {
  const entries = useKeyPairSearchParams();
  const search = columnFilterSchema.safeParse(entries);

  const {
    data: transactions,
    error,
    isLoading,
    isSuccess,
  } = useTransactions({
    page: 1,
    pageSize: 15,
    filters: search.success && Object.keys(search.data).length > 0 ? search.data : undefined,
  });
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  // if (!search.success) {
  //   return (
  //     <div className="flex  flex-col items-center gap-4">
  //       <MessageDisplay message="Invalid search parameters" />
  //       <Button asChild className="w-full">
  //         <Link to="/app/transactions">Clear filters</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  console.log({ transactions, accounts, categories, tags });

  const filters = filterFields(categories, accounts, tags);

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Last Transactions</h1>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        paginatedData={transactions}
        filterFields={filters}
        isLoading={isLoading}
      />
    </>
  );
}
