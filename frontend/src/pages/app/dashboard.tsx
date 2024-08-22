import { useQueryNewsletters } from "../../services/newsletter";
import { Newsletter } from "../../types/Newsletter";

export function Dashboard() {
  const { data, isSuccess } = useQueryNewsletters();

  return (
    <div>
      <h3>Dashboard</h3>
      <p>Protected route</p>
      {isSuccess && (
        <ul>
          {data.map((newsletter: Newsletter) => (
            <li key={newsletter.id}>{newsletter.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
