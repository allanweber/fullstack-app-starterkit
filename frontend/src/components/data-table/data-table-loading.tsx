import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface DataTablePaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableLoading<TData, TValue>({
  columns,
}: DataTablePaginationProps<TData, TValue>) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </TableCell>
    </TableRow>
  );
}
