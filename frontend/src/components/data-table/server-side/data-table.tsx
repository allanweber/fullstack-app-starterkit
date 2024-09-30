import type { ColumnDef, SortingState, VisibilityState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

import { Paginated } from "@/types/paginated";
import { DataTableFilterField } from "../types";
import { DataTableFilterControls } from "./data-table-filter-controls";
import { TableLoading } from "./data-table-loading";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  paginatedData: Paginated<TData> | undefined | null;
  isLoading: boolean;
  filterFields?: DataTableFilterField<TData>[];
  sortingState?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  paginatedData,
  isLoading,
  filterFields = [],
  sortingState = [],
}: DataTableProps<TData, TValue>) {
  // const updateSearchParams = useUpdateSearchParams();
  // const [searchParams] = useSearchParams();

  // const sortingStart = sortingState;
  // const [sorting, setSorting] = React.useState<SortingState>(sortingStart);

  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    "data-table-visibility",
    {}
  );
  const [controlsOpen, setControlsOpen] = useLocalStorage("data-table-controls", true);

  const table = useReactTable({
    data: [],
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    // onSortingChange: (updater) => {
    //   const newSortingValue = updater instanceof Function ? updater(sorting) : updater;
    //   if (newSortingValue.length === 0) {
    //     updateSearchParams({
    //       sortBy: null,
    //       sortDirection: null,
    //     });
    //   } else {
    //     updateSearchParams({
    //       sortBy: newSortingValue[0].id,
    //       sortDirection: newSortingValue[0].desc ? "desc" : "asc",
    //     });
    //   }
    //   setSorting(updater);
    // },
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
          "w-full p-1 sm:sticky sm:top-0 sm:h-screen sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72",
          !controlsOpen && "hidden"
        )}
      >
        <div className="-m-1 h-full p-1 sm:overflow-x-hidden sm:overflow-y-auto">
          <DataTableFilterControls columns={columns} filterFields={filterFields} />
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
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getHeaderGroups()[0].headers.length}>
                    <TableLoading />
                  </TableCell>
                </TableRow>
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
        {paginatedData && <DataTablePagination pagination={paginatedData.pagination} />}
      </div>
    </div>
  );
}
