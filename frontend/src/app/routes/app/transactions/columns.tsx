import ColoredNumber from '@/components/colored-number';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import NumberDisplay from '@/components/number-display';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/lib/colors';
import { isArrayOfDates, isArrayOfNumbers } from '@/lib/utils';
import { Category, CategoryType } from '@/types/category';
import { Account, Tag, Tags, Transaction } from '@/types/transaction';
import type { ColumnDef } from '@tanstack/react-table';
import { format, isSameDay } from 'date-fns';
import { Minus } from 'lucide-react';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const value = new Date(row.getValue('date'));
      return (
        <div className="text-xs text-muted-foreground">
          {format(new Date(`${value}`), 'LLL dd, y')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      let rowValue = row.getValue(id);
      if (typeof rowValue === 'number') {
        rowValue = new Date(rowValue);
      }
      if (value instanceof Date && rowValue instanceof Date) {
        return isSameDay(value, rowValue);
      }
      if (Array.isArray(value)) {
        if (isArrayOfDates(value) && rowValue instanceof Date) {
          const sorted = value.sort((a, b) => a.getTime() - b.getTime());
          return (
            sorted[0].getTime() <= rowValue.getTime() &&
            rowValue.getTime() <= sorted[1].getTime()
          );
        }
      }
      return false;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('amount');
      if (typeof value === 'undefined') {
        return <Minus className="h-4 w-4 text-muted-foreground/50" />;
      }

      const number = value as number;
      const signedValue =
        row.original.type === CategoryType.Expense ? number * -1 : number;

      return (
        <div>
          <span className="font-mono">
            <ColoredNumber value={signedValue} className="font-mono">
              <NumberDisplay currency="€">{number}</NumberDisplay>
            </ColoredNumber>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as number;
      if (typeof value === 'number') return value === Number(rowValue);
      if (Array.isArray(value) && isArrayOfNumbers(value)) {
        const sorted = value.sort((a, b) => a - b);
        return sorted[0] <= rowValue && rowValue <= sorted[1];
      }
      return false;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const value = row.getValue('category') as Category;
      return <div className="max-w-[200px] truncate">{`${value.name}`}</div>;
    },
    filterFn: (row, id, value) => {
      const category = row.getValue(id) as Category;
      if (typeof value === 'string') {
        return category.id === Number(value);
      }
      if (Array.isArray(value))
        return value.some((i) => category.id === Number(i));
      return false;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const value = row.getValue('description');
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
    accessorKey: 'account',
    header: 'Account',
    cell: ({ row }) => {
      const value = row.getValue('account') as Account;
      return <div className="max-w-[200px] truncate">{`${value.name}`}</div>;
    },
    filterFn: (row, id, value) => {
      const account = row.getValue(id) as Account;
      if (typeof value === 'string') {
        return account.id === Number(value);
      }
      if (Array.isArray(value))
        return value.some((i) => account.id === Number(i));
      return false;
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const value = row.getValue('tags') as Tag[];
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((tag) => {
            const colorClass = Color[tag.color].badge;
            return (
              <Badge key={tag.id} className={colorClass}>
                {tag.name}
              </Badge>
            );
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const tags = row.getValue(id) as Tags[];
      if (typeof value === 'string') {
        return tags.some((i) => i.tag.id === Number(value));
      }

      if (Array.isArray(value))
        return value.some((i) => tags.some((tag) => tag.tag.id === Number(i)));
      return false;
    },
  },
];
