import { Skeleton } from "@/components/ui/skeleton";

export const TableLoading = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};
