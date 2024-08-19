import { Link, Outlet } from 'react-router-dom';

type Invoice = {
  id: number;
  title: string;
  body: string;
};

export function Invoices() {
  const invoices = [
    { id: 1, title: 'Invoice 1', body: 'This is the first invoice.' },
    { id: 2, title: 'Invoice 2', body: 'This is the second invoice.' },
    { id: 3, title: 'Invoice 3', body: 'This is the third invoice.' },
  ] as Invoice[];

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 min-h-[500px]">
      <div className="col-span-1 py-2 pl-2 pr-4 md:border-r">
        <p className="mb-2">Choose an invoice from the list below.</p>
        <ol className="grid gap-2">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link
                to={`${invoice.id}`}
                className="text-blue-600 hover:opacity-75"
              >
                <span className="tabular-nums">
                  #{invoice.id.toString().padStart(2, '0')}
                </span>{' '}
                - {invoice.title.slice(0, 16)}...
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="col-span-2 md:col-span-4 py-2 px-4">
        <Outlet />
      </div>
    </div>
  );
}
