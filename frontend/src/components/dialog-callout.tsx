import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FormDialogProps } from '@/types/form-props';
import { useState } from 'react';

type EditTransactionButtonProps<TBody> = {
  Dialog: React.ComponentType<FormDialogProps<TBody>>;
  children: React.ReactNode;
  description?: string;
  record?: TBody;
};

export const DialogCallout = <TBody,>({
  Dialog,
  children,
  description,
  record,
}: EditTransactionButtonProps<TBody>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-0 font-normal"
              variant="link"
              onClick={() => setOpen(true)}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog record={record} open={open} setOpen={setOpen} />
    </>
  );
};
