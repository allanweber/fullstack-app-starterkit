import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queryNewsletters } from '../services/newsletter';
import { Newsletter } from '../types/Newsletter';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(queryNewsletters());
  },
  component: Index,
});

function Index() {
  const { data, isSuccess } = useSuspenseQuery(queryNewsletters());

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div>Newsletter Subscribers</div>
      <ul>
        {isSuccess &&
          data.map((item: Newsletter) => <li key={item.id}>{item.email}</li>)}
      </ul>
    </div>
  );
}
