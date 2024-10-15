import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { handleErrors } from './routes/middleware';

export default (app: express.Application) => {
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' }).end();
  });
  app.head('/api/health', (req, res) => {
    res.status(200).end();
  });

  app.use(express.urlencoded());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    morgan(
      ':date[iso] :remote-addr [:method:url] :status :res[content-length] bytes - :response-time ms [:user-agent]'
    )
  );

  //TODO: Search about errorHandler/Listeners

  /**
   * Application routes under /app
   */
  app.use('/api', routes());

  /**
   * Static files under /public including react frontend application
   */
  app.use(express.static(path.join(__dirname, '../../public')));
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // All other routes are handled by the frontend
  app.get('**', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  //Error handler must be the last middleware
  app.use(handleErrors);
};
