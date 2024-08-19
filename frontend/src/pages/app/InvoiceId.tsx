import { useParams } from 'react-router-dom';

export function InvoiceId() {
  const { invoiceId } = useParams();

  if (!invoiceId) {
    return <p>Invoice not found.</p>;
  }

  const invoice = {
    id: parseInt(invoiceId),
    title: `Invoice ${invoiceId}`,
    body: `This is invoice ${invoiceId}.`,
  };

  return (
    <section className="grid gap-2">
      <h2 className="text-lg">
        <strong>Invoice No.</strong> #{invoice.id.toString().padStart(2, '0')}
      </h2>
      <p>
        <strong>Invoice title:</strong> {invoice.title}
      </p>
      <p>
        <strong>Invoice body:</strong> {invoice.body}
      </p>
    </section>
  );
}
