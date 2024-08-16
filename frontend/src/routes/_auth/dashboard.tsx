import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/dashboard')({
  component: () => <div>Hello /_auth/dashboard!</div>,
});
