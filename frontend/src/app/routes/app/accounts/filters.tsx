import { DataTableFilterField } from '@/components/data-table/types';
import { Account } from '@/types/account';

export const filterFields = () =>
  [
    {
      label: 'Name',
      value: 'name',
      type: 'input',
      defaultOpen: true,
    },
  ] satisfies DataTableFilterField<Account>[];
