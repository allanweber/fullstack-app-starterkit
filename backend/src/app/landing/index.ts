import { NextFunction, Request, Response } from 'express';
import { messages } from '../../utils/messages';
import { sendContactEmail } from '../emails/email-service';
import { contactSchema } from './landing.schemas';

export const contact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contact = contactSchema.safeParse(req.body);
    if (!contact.success) {
      return res.status(400).json(contact.error.issues);
    }

    await sendContactEmail(
      contact.data.firstName + ' ' + contact.data.lastName,
      contact.data.email,
      contact.data.message
    );

    return res.status(200).json({
      code: messages.CONTACT_SUCCESS_CODE,
      message: messages.CONTACT_SUCCESS,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
