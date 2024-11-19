import { DataTableFilterField } from '@/components/data-table/types';
import { Category, CategoryType } from '@/types/category';

export const filterFields = () =>
  [
    {
      label: 'Name',
      value: 'name',
      type: 'input',
      defaultOpen: true,
    },
    {
      label: 'Type',
      value: 'type',
      type: 'checkbox',
      defaultOpen: true,
      options: Object.values(CategoryType).map((type) => ({
        label: type[0].toUpperCase() + type.slice(1).toLocaleLowerCase(),
        value: type,
      })),
    },
  ] satisfies DataTableFilterField<Category>[];
