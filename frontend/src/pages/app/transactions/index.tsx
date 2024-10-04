import { DataTable } from "@/components/data-table/data-table";
import { MessageDisplay } from "@/components/MessageDisplay";
import useKeyPairSearchParams from "@/hooks/useKeyPairSearchParams";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import { useAccounts } from "@/services/accounts";
import { useCategories } from "@/services/categories";
import { useTags } from "@/services/tags";
import { useTransactions } from "@/services/transactions";
import { columnFilterSchema, columns } from "./columns";
import { filterFields } from "./filters";

export default function Transactions() {
  const pageSearch = usePaginationSearchParams();
  const search = columnFilterSchema.safeParse(useKeyPairSearchParams());

  const pageRequest = {
    page: pageSearch.page,
    pageSize: pageSearch.pageSize,
    sortBy: pageSearch.sortBy,
    sortDirection: pageSearch.sortDirection,
    filters: search.success && Object.keys(search.data).length > 0 ? search.data : undefined,
  };

  const { data, error, isLoading } = useTransactions(pageRequest);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const { data: transactions, pagination } = data || {};

  const defaultColumnFilters = Object.entries(search.data || {}).map(([key, value]) => ({
    id: key,
    value,
  }));

  const filters = filterFields(categories, accounts, tags);

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Last Transactions</h1>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        data={transactions}
        defaultColumnFilters={defaultColumnFilters}
        filterFields={filters}
        serverSide={{
          isLoading,
          pagination,
        }}
      />
    </>
  );
}
