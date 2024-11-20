import { useTags } from '@/app/services/tags';
import { DataTable } from '@/components/data-table/data-table';
import { MessageDisplay } from '@/components/message-display';
import useTableSearchParams from '@/hooks/use-table-search-params';
import { filterSchema } from '@/types/tag';
import { columns } from './columns';
import { filterFields } from './filters';

export const Tags = () => {
  const { columnsFiltered } = useTableSearchParams(filterSchema);
  const { data: tags, error, isLoading } = useTags();
  const filters = filterFields();

  return (
    <>
      {error && <MessageDisplay message={error.message} />}
      <DataTable
        columns={columns}
        data={tags}
        defaultColumnFilters={columnsFiltered}
        filterFields={filters}
        isLoading={isLoading}
      />
    </>
  );
};
