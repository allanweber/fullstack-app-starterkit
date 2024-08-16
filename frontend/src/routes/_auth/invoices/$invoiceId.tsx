import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/invoices/$invoiceId')({
  loader: async ({ params: { invoiceId } }) => {
    return {
      invoice: {
        id: parseInt(invoiceId),
        title: `Invoice ${invoiceId}`,
        body: `This is invoice ${invoiceId}.`,
      },
    };
  },
  component: InvoicePage,
});

function InvoicePage() {
  const { invoice } = Route.useLoaderData();

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
