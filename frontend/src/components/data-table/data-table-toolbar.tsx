import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Table } from '@tanstack/react-table';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

import useUpdateSearchParams from '@/hooks/use-update-search-params';

import { Kbd } from '@/components/ui/kbd';
import { useEffect } from 'react';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  controlsOpen: boolean;
  setControlsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  component?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  controlsOpen,
  setControlsOpen,
  component,
}: DataTableToolbarProps<TData>) {
  const filters = table.getState().columnFilters;
  const sorting = table.getState().sorting;
  const updateSearchParams = useUpdateSearchParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setControlsOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setControlsOpen]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setControlsOpen((prev) => !prev)}
              >
                {controlsOpen ? (
                  <>
                    <PanelLeftClose className="mr-2 h-4 w-4" /> Hide Controls
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="mr-2 h-4 w-4" /> Show Controls
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Toggle controls with
                <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
                  <span className="mr-0.5">⌘</span>
                  <span>B</span>
                </Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        {filters.length || sorting.length ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.resetSorting();
              const resetValues = filters.reduce<Record<string, null>>(
                (prev, curr) => {
                  prev[curr.id] = null;
                  return prev;
                },
                {},
              );
              if (sorting.length) {
                resetValues.sortBy = null;
                resetValues.sortDirection = null;
              }
              updateSearchParams(resetValues);
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
        {component}
      </div>
    </div>
  );
}
