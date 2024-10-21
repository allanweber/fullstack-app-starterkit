import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { setupSwagger } from './components/lib/swagger';
import { handleErrors } from './components/middlewares/error.middleware';
import { trimMiddleware } from './components/middlewares/trim.middleware';
import { unknownRoutesMiddleware } from './components/middlewares/unknown-routes.middleware';
import { globalThrottler } from './components/throttlers/global.throttler';
import env from './env';
import logger from './logger';
import { apiRouter } from './routes';

const app = express();

async function startServer() {
  // disable `x-powered-by` header for security reasons
  app.disable('x-powered-by');

  // Trust the `X-Forwarded-For` header for Cloudflare and other reverse proxies
  // to send the real IP address of the client by this header.
  app.set('trust proxy', 1);

  app.head('/api/health', (req, res) => {
    res.status(200).end();
  });
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' }).end();
  });

  app.use(cors());

  // We parse the Content-Type `application/x-www-form-urlencoded`
  // ex: key1=value1&key2=value2.
  // to be able to access these forms's values in req.body
  app.use(express.urlencoded({ extended: true }));

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // We trim the body of the incoming requests to remove any leading or trailing whitespace
  app.use(trimMiddleware);

  setupSwagger({ app });

  app.use(
    morgan(
      ':date[iso] :remote-addr [:method:url] :status :res[content-length] bytes - :response-time ms [:user-agent]'
    )
  );

  // ----------------------------------------------------------------
  // Application routes under /app
  // ----------------------------------------------------------------
  app.use('/api', globalThrottler, apiRouter);

  // ----------------------------------------------------------------
  // Static files under /public including react frontend application
  // ----------------------------------------------------------------
  app.use(express.static(path.join(__dirname, '../../public')));
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // ----------------------------------------------
  // All other routes are handled by the frontend
  // ----------------------------------------------
  app.get('**', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // ----------------------------------------
  // Unknown routes handler
  // @important: Should be just before the last `app.use`
  // ----------------------------------------
  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------
  app.use(handleErrors);

  app
    .listen(Number(env.PORT), '0.0.0.0', () => {
      logger.info(`
    ################################################
    🛡️  Server listening on port: ${env.PORT} 🛡️
    ################################################
  `);
    })
    .on('error', (err) => {
      logger.error(err);
    });
}
startServer();
