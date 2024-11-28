import { FormProps } from '@/types/form-props';
import { Transaction } from '@/types/transaction';

export const TransactionForm = ({ record, onSave }: FormProps<Transaction>) => {
  return (
    <>
      {record ? (
        <div>
          <h1>Edit Transaction</h1>
          <p>Editing transaction with id: {record.id}</p>
          <button onClick={() => onSave(record)}>Save</button>
        </div>
      ) : (
        <div>
          <h1>Add Transaction</h1>
        </div>
      )}
    </>
  );
};
