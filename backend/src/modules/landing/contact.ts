import { NextFunction, Request, Response } from 'express';
import { sendContactEmail } from '../../components/emails/email-service';
import { validate } from '../../components/lib/validator';
import { messages } from '../../utils/messages';
import { contactSchema } from './landing.schemas';

export const contact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body: contact } = await validate({
      req,
      schema: { body: contactSchema },
    });

    await sendContactEmail(
      contact.firstName + ' ' + contact.lastName,
      contact.email,
      contact.message
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
