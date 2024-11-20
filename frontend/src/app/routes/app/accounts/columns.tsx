import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Account } from '@/types/account';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: true,
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
];
