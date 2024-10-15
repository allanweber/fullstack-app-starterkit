import { PrismaClient } from '@prisma/client';
import logger from './logger';

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

prismaClient.$on('query', (e: any) => {
  logger.info('Query: ' + e.query);
  logger.info('Params: ' + e.params);
  logger.info('Duration: ' + e.duration + 'ms');
});
