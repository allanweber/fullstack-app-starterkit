import express from 'express';
import env from './env';
import expressStarter from './express';
import logger from './logger';

async function startServer() {
  const app = express();
  await expressStarter(app);

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
