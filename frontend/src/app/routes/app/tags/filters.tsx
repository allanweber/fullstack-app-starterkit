import { DataTableFilterField, Option } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { Tag } from '@/types/tag';

export const filterFields = () =>
  [
    {
      label: 'Name',
      value: 'name',
      type: 'input',
      defaultOpen: true,
    },
    {
      label: 'Color',
      value: 'color',
      type: 'checkbox',
      defaultOpen: true,
      component: (props: Option) => {
        if (typeof props.value === 'boolean') return null;
        if (typeof props.value === 'undefined') return null;

        const color = Color[props.value as keyof typeof Color] || Color.gray;

        return (
          <div className="flex w-full items-center justify-between gap-3">
            <Badge className={color.badge}>{props.label}</Badge>
            <span className={cn('h-2 w-2 rounded-full', color.dot)} />
          </div>
        );
      },
      options: Object.keys(Color).map((colorKey) => ({
        label: colorKey,
        value: colorKey,
      })),
    },
  ] satisfies DataTableFilterField<Tag>[];
