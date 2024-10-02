import { DataTable } from "@/components/data-table/data-table";
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

  const pageRequest = {
    page: 1,
    pageSize: 15,
    filters: search.success && Object.keys(search.data).length > 0 ? search.data : undefined,
  };

  const { data: transactions, error, isLoading, isSuccess } = useTransactions(pageRequest);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const defaultColumnFilters = Object.entries(search.data || {}).map(([key, value]) => ({
    id: key,
    value,
  }));

  const filters = filterFields(categories, accounts, tags);

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Last Transactions</h1>
      {error && <MessageDisplay message={error.message} />}
      {isSuccess && transactions && (
        <DataTable
          columns={columns}
          data={transactions.data}
          defaultColumnFilters={defaultColumnFilters}
          filterFields={filters}
          serverSide={true}
        />
      )}
    </>
  );
}
