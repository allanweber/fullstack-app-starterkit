import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Category, CategoryType } from '@/types/category';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('name');
      return <div className="max-w-[200px] truncate">{`${value}`}</div>;
    },
    filterFn: (row, id, value) => {
      if (typeof value === 'undefined' || value === null) return true;
      const rowValue = row.getValue(id) as string;
      if (typeof value === 'string')
        return rowValue.toLowerCase().includes(value.toLowerCase());
      return false;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const value = row.getValue('type') as CategoryType;
      return <div className="max-w-[200px] truncate">{`${value}`}</div>;
    },
    filterFn: (row, id, value) => {
      const type = row.getValue(id) as CategoryType;

      if (typeof value === 'string') {
        return type === value;
      }
      if (Array.isArray(value))
        return value.some((i) => type === (i as CategoryType));
      return false;
    },
  },
];
