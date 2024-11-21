import { NoDataToDisplay } from '@/components/no-data-to-display';

export const Dashboard = () => {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <NoDataToDisplay />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <NoDataToDisplay />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <NoDataToDisplay />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <NoDataToDisplay />
      </div>
    </>
  );
};
