import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound({ to }: { to: string }) {
  return (
    <div className="mt-10 justify-center p-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-4 text-2xl font-light text-gray-600">Page not found</p>
      <p className="mb-8 text-lg text-gray-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to={to} className="mb-4 inline-block text-sm">
        <Button variant="default">Go back home</Button>
      </Link>
    </div>
  );
}
