import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormDialogProps } from '@/types/form-props';
import { Transaction } from '@/types/transaction';
import { TransactionForm } from './transaction-form';

export const TransactionDialog = ({
  open,
  setOpen,
  record,
}: FormDialogProps<Transaction>) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
          <DialogDescription>
            Register to get tapaScript content for FREE!
          </DialogDescription>
        </DialogHeader>
        <TransactionForm record={record} onSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
