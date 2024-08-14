import cors from 'cors';
import express from 'express';
import path from 'path';
import db from './db';
import { newsletter } from './db/schema';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/newsletter', async (req, res) => {
  const news = await db.select().from(newsletter);
  res.json(news);
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
