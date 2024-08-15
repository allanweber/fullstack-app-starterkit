import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';

export default (app: express.Application) => {
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' }).end();
  });
  app.head('/api/health', (req, res) => {
    res.status(200).end();
  });

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
   * Static files under /public including react frontend application
   */
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  /**
   * Application routes under /app
   */
  app.use('/api', routes());

  //Not found
  app.get('**', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
};
