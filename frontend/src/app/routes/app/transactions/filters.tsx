import { DataTableFilterField, Option } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { Transaction } from '@/types/transaction';

export const filterFields = (
  categories: Category[] | undefined,
  accounts: Account[] | undefined,
  tags: Tag[] | undefined,
) =>
  [
    {
      label: 'Description',
      value: 'description',
      type: 'input',
      defaultOpen: true,
    },
    {
      label: 'Account',
      value: 'account',
      type: 'checkbox',
      defaultOpen: true,
      options: accounts?.map(({ id, name }) => ({ label: name, value: id })),
    },
    {
      label: 'Time Range',
      value: 'date',
      type: 'timerange',
      defaultOpen: true,
      commandDisabled: true,
    },
    {
      label: 'Amount',
      value: 'amount',
      type: 'slider',
      min: 0,
      max: 3000,
      defaultOpen: true,
      hint: '$',
    },
    {
      label: 'Categories',
      value: 'category',
      type: 'checkbox',
      options: categories?.map(({ id, name }) => ({ label: name, value: id })),
    },
    {
      label: 'Tags',
      value: 'tags',
      type: 'checkbox',
      component: (props: Option) => {
        if (typeof props.value === 'boolean') return null;
        if (typeof props.value === 'undefined') return null;
        const color =
          tags?.find((tag) => tag.id === props.value)?.color || 'gray';

        return (
          <div className="flex w-full items-center justify-between gap-3">
            <Badge className={Color[color].badge}>{props.label}</Badge>
            <span className={cn('h-2 w-2 rounded-full', Color[color].dot)} />
          </div>
        );
      },
      options: tags?.map(({ id, name }) => ({ label: name, value: id })),
    },
  ] satisfies DataTableFilterField<Transaction>[];
