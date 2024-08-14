import { useEffect, useState } from 'react';

type Newsletter = {
  email: string;
  createdAt: Date;
};

export const Newsletter = () => {
  const [message, setMessage] = useState<Newsletter[]>([]);

  useEffect(() => {
    fetch('/api/newsletter')
      .then((response) => response.json())
      .then((data) => setMessage(data));
  }, []);

  return (
    <>
      <div>Newsletter Subscribers</div>
      <ul>
        {message.map((item) => (
          <li key={item.email}>{item.email}</li>
        ))}
      </ul>
    </>
  );
};
