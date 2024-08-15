import { useEffect, useState } from 'react';

type Newsletter = {
  id: number;
  email: string;
  createdAt: Date;
};

export const Newsletter = () => {
  const [message, setMessage] = useState<Newsletter[]>([]);

  useEffect(() => {
    fetch('/api/v1/newsletter')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setMessage(data));
  }, []);

  return (
    <>
      <div>Newsletter Subscribers</div>
      <ul>
        {message && message.map((item) => <li key={item.id}>{item.email}</li>)}
      </ul>
    </>
  );
};
