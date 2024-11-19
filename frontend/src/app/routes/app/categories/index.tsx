import { useCategories } from '@/app/services/categories';
import { DataTable } from '@/components/data-table/data-table';
import { MessageDisplay } from '@/components/message-display';
import useTableSearchParams from '@/hooks/use-table-search-params';
import { filterSchema } from '@/types/category';
import { columns } from './columns';
import { filterFields } from './filters';

export const Categories = () => {
  const { columnsFiltered } = useTableSearchParams(filterSchema);
  const { data: categories, error, isLoading } = useCategories();

  return (
    <>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        data={categories}
        defaultColumnFilters={columnsFiltered}
        filterFields={filterFields()}
        isLoading={isLoading}
      />
    </>
  );
};
