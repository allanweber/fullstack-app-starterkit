/* eslint-disable @typescript-eslint/no-unused-vars */

import logger from '../../logger';
import { messages } from '../utils/messages';

export const handleErrors = (error: any, req: any, res: any, next: any) => {
  const status = error.status || 500;
  const message = error.message || messages.FRIENDLY_ERROR;
  const code = error.code || messages.FRIENDLY_ERROR_CODE;
  const details = error.details;
  logger.error({
    url: req.protocol + '://' + req.hostname + req.originalUrl,
    message: message.message,
    stack: error.stack,
  });
  res.status(status).json({ success: false, code, message, details });
};
