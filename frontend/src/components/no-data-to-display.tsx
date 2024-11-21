import { InboxIcon } from 'lucide-react';

interface NoDataToDisplayProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

const defaultProps: NoDataToDisplayProps = {
  title: 'No data to display',
  message:
    "It looks like there's no data available yet. Try adding some new items.",
};

export const NoDataToDisplay = ({
  title = defaultProps.title,
  message = defaultProps.message,
  action,
}: NoDataToDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[30vh] gap-6">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
        <InboxIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
        {action && action}
      </div>
    </div>
  );
};
