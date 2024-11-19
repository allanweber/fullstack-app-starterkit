import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

import useUpdateSearchParams from '@/hooks/use-update-search-params';
import { PaginatedState } from '@/types/paginated';
import { useSearchParams } from 'react-router-dom';
import { DataTableFilterControls } from './data-table-filter-controls';
import { DataTableLoading } from './data-table-loading';
import { DataTablePagination } from './data-table-pagination';
import { DataTableServerPagination } from './data-table-server-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableFilterField } from './types';

interface ServerSide {
  isLoading: boolean;
  pagination?: PaginatedState;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  filterFields?: DataTableFilterField<TData>[];
  sortingState?: SortingState;
  isLoading?: boolean;
  serverSide?: ServerSide;
}

const fallbackPaginatedState: PaginatedState = {
  page: 1,
  pageSize: 25,
  total: 0,
  totalPages: 0,
};

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
  filterFields = [],
  sortingState = [],
  isLoading = false,
  serverSide = undefined,
}: DataTableProps<TData, TValue>) {
  const updateSearchParams = useUpdateSearchParams();
  const [searchParams] = useSearchParams();
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);

  const sortingStart = searchParams.get('sortBy')
    ? [
        {
          id: searchParams.get('sortBy')!,
          desc: searchParams.get('sortDirection')
            ? searchParams.get('sortDirection') === 'desc'
            : false,
        },
      ]
    : sortingState;
  const [sorting, setSorting] = React.useState<SortingState>(sortingStart);

  const paginationStart = {
    pageIndex: searchParams.get('page')
      ? Number(searchParams.get('page')) - 1
      : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : 25,
  };
  const [pagination, setPagination] =
    React.useState<PaginationState>(paginationStart);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>('data-table-visibility', {});
  const [controlsOpen, setControlsOpen] = useLocalStorage(
    'data-table-controls',
    true,
  );

  React.useEffect(() => {
    updateSearchParams({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const table = useReactTable({
    data: data || [],
    columns,
    state: { columnFilters, sorting, columnVisibility, pagination },
    manualFiltering: !!serverSide,
    manualSorting: !!serverSide,
    manualPagination: !!serverSide,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: (updater) => {
      const newSortingValue =
        updater instanceof Function ? updater(sorting) : updater;
      if (newSortingValue.length === 0) {
        updateSearchParams({
          sortBy: null,
          sortDirection: null,
        });
      } else {
        updateSearchParams({
          sortBy: newSortingValue[0].id,
          sortDirection: newSortingValue[0].desc ? 'desc' : 'asc',
        });
      }
      setSorting(updater);
    },
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const newPaginationValue =
          updater instanceof Function ? updater(old) : updater;
        return newPaginationValue;
      });
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div
        className={cn(
          'w-full p-1 sm:sticky sm:top-0 sm:h-screen sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72',
          !controlsOpen && 'hidden',
        )}
      >
        <div className="-m-1 h-full p-1 sm:overflow-x-hidden sm:overflow-y-auto">
          <DataTableFilterControls
            table={table}
            columns={columns}
            filterFields={filterFields}
          />
        </div>
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
        <DataTableToolbar
          table={table}
          controlsOpen={controlsOpen}
          setControlsOpen={setControlsOpen}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading || serverSide?.isLoading ? (
                <DataTableLoading columns={columns} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {serverSide ? (
          <DataTableServerPagination
            pagination={serverSide.pagination || fallbackPaginatedState}
            table={table}
          />
        ) : (
          <DataTablePagination table={table} />
        )}
      </div>
    </div>
  );
}
