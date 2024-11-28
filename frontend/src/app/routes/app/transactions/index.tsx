import { useAccounts } from '@/app/services/accounts';
import { useCategories } from '@/app/services/categories';
import { useTags } from '@/app/services/tags';
import { useTransactions } from '@/app/services/transactions';
import { DataTable } from '@/components/data-table/data-table';
import { MessageDisplay } from '@/components/message-display';
import { NoDataToDisplay } from '@/components/no-data-to-display';
import useTableSearchParams from '@/hooks/use-table-search-params';
import { filterSchema } from '@/types/transaction';
import { PlusCircleIcon } from 'lucide-react';
import { DialogCallout } from '../../../../components/dialog-callout';
import { columns } from './columns';
import { TransactionDialog } from './components/transaction-dialog';
import { filterFields } from './filters';

const AddTransactionButton = () => (
  <DialogCallout Dialog={TransactionDialog} description="Add a new transaction">
    <PlusCircleIcon className="h-4 w-4" />
    Add New Transaction
  </DialogCallout>
);

export const Transactions = () => {
  const { pageRequest, columnsFiltered } = useTableSearchParams(filterSchema);

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data, error, isLoading } = useTransactions(pageRequest);
  const { data: transactions, pagination } = data || {};

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
        emptyState={
          <NoDataToDisplay
            title="No transactions found"
            message="There are no transactions to display. Try adding some new transactions."
            action={<AddTransactionButton />}
          />
        }
        toolbarProps={{
          component: transactions && transactions.length > 0 && (
            <AddTransactionButton />
          ),
        }}
      />
    </>
  );
};
