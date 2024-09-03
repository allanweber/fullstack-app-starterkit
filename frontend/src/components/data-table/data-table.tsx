import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useSearchParams } from "react-router-dom";
import { DataTableFilterControls } from "./data-table-filter-controls";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableFilterField } from "./types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  filterFields?: DataTableFilterField<TData>[];
  sortingState?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
  filterFields = [],
  sortingState = [],
}: DataTableProps<TData, TValue>) {
  const updateSearchParams = useUpdateSearchParams();
  const [searchParams] = useSearchParams();
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);

  const sortingStart = searchParams.get("sortBy")
    ? [
        {
          id: searchParams.get("sortBy")!,
          desc: searchParams.get("sortDirection")
            ? searchParams.get("sortDirection") === "desc"
            : false,
        },
      ]
    : sortingState;
  const [sorting, setSorting] = React.useState<SortingState>(sortingStart);

  const paginationStart = {
    pageIndex: searchParams.get("page") ? Number(searchParams.get("page")) - 1 : 0,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 15,
  };
  const [pagination, setPagination] = React.useState<PaginationState>(paginationStart);

  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    "data-table-visibility",
    {}
  );
  const [controlsOpen, setControlsOpen] = useLocalStorage("data-table-controls", true);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting, columnVisibility, pagination },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: (updater) => {
      const newSortingValue = updater instanceof Function ? updater(sorting) : updater;
      if (newSortingValue.length === 0) {
        updateSearchParams({
          sortBy: null,
          sortDirection: null,
        });
      } else {
        updateSearchParams({
          sortBy: newSortingValue[0].id,
          sortDirection: newSortingValue[0].desc ? "desc" : "asc",
        });
      }
      setSorting(updater);
    },
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const newPaginationValue = updater instanceof Function ? updater(old) : updater;
        updateSearchParams({
          page: newPaginationValue.pageIndex + 1,
          pageSize: newPaginationValue.pageSize,
        });
        return newPaginationValue;
      });
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
      const map = getFacetedUniqueValues<TData>()(table, columnId)();
      // TODO: it would be great to do it dynamically, if we recognize the row to be Array.isArray
      if (["regions", "tags"].includes(columnId)) {
        const rowValues = table
          .getGlobalFacetedRowModel()
          .flatRows.map((row) => row.getValue(columnId) as string[]);
        for (const values of rowValues) {
          for (const value of values) {
            const prevValue = map.get(value) || 0;
            map.set(value, prevValue + 1);
          }
        }
      }
      return map;
    },
  });

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div
        className={cn(
          "w-full p-1 sm:sticky sm:top-0 sm:h-screen sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72",
          !controlsOpen && "hidden"
        )}
      >
        <div className="-m-1 h-full p-1 sm:overflow-x-hidden sm:overflow-y-scroll">
          <DataTableFilterControls table={table} columns={columns} filterFields={filterFields} />
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
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
