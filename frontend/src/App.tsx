import { useEffect, useState } from 'react';
import { Newsletter } from './pages/Newsletter';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api')
      .then((response) => response.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <>
      <div>
        <h1>{message}</h1>
      </div>
      <Newsletter />
    </>
  );
}

export default App;
