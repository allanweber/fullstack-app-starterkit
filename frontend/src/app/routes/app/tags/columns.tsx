import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/lib/colors';
import { Tag } from '@/types/tag';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Tag>[] = [
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
    accessorKey: 'color',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('color') as string;
      const colorClass = Color[value as keyof typeof Color].badge;
      return <Badge className={colorClass}>{value}</Badge>;
    },
    filterFn: (row, id, value) => {
      const type = row.getValue(id) as string;

      if (typeof value === 'string') {
        return type === value;
      }
      if (Array.isArray(value)) return value.some((i) => type === i);
      return false;
    },
  },
];
