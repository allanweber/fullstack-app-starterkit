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
  const paginationParams = usePaginationSearchParams();
  const searchParams = columnFilterSchema.safeParse(useKeyPairSearchParams());

  const pageRequest = {
    page: paginationParams.page,
    pageSize: paginationParams.pageSize,
    sortBy: paginationParams.sortBy,
    sortDirection: paginationParams.sortDirection,
    filters:
      searchParams.success && Object.keys(searchParams.data).length > 0
        ? searchParams.data
        : undefined,
  };

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data, error, isLoading } = useTransactions(pageRequest);
  const { data: transactions, pagination } = data || {};

  const columnsFiltered = Object.entries(searchParams.data || {}).map(([key, value]) => ({
    id: key,
    value,
  }));

  const filters = filterFields(categories, accounts, tags);

  return (
    <>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        data={transactions}
        defaultColumnFilters={columnsFiltered}
        filterFields={filters}
        serverSide={{
          isLoading,
          pagination,
        }}
      />
    </>
  );
}
