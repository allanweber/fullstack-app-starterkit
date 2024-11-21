import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect } from 'react';

export const AddTransactionButton = () => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'n' && e.altKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        console.log('Add new transaction');
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="inline-flex items-center" size="sm">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add New Transaction
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Create a new transaction
            <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
              <span className="mr-0.5">⌘</span>
              <span className="mr-0.5">Alt</span>
              <span>N</span>
            </Kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
