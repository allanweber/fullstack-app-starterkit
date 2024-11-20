import { useAccounts } from '@/app/services/accounts';
import { DataTable } from '@/components/data-table/data-table';
import { MessageDisplay } from '@/components/message-display';
import useTableSearchParams from '@/hooks/use-table-search-params';
import { filterSchema } from '@/types/account';
import { columns } from './columns';
import { filterFields } from './filters';

export const Accounts = () => {
  const { columnsFiltered } = useTableSearchParams(filterSchema);
  const { data: accounts, error, isLoading } = useAccounts();
  const filters = filterFields();

  return (
    <>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        data={accounts}
        defaultColumnFilters={columnsFiltered}
        filterFields={filters}
        isLoading={isLoading}
      />
    </>
  );
};
