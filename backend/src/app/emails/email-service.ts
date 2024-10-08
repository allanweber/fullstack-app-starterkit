import { render } from '@react-email/components';
import { AccountActivation } from './AccountActivation';

import { Resend } from 'resend';
import env from '../../env';
import ContactConfirmation from './ContactConfirmation';
import ResetPassword from './ResetPassword';

const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

export async function sendActivationEmail(email: string, token: string) {
  const subject = 'Activate your account';
  const emailHtml = await render(AccountActivation({ token }));
  await sendEmail(email, subject, emailHtml);
}

export async function sendChangePasswordEmail(email: string, token: string) {
  const subject = 'Change your password';
  const emailHtml = await render(ResetPassword({ token }));
  await sendEmail(email, subject, emailHtml);
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  const subject = 'Contact Form Submission';
  const emailHtml = await render(ContactConfirmation({ name, email, message }));
  await sendEmail(email, subject, emailHtml, env.BCC_EMAIL);
}

export async function sendEmail(
  email: string,
  subject: string,
  body: string,
  bcc?: string
) {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    html: body,
    bcc,
  });

  if (error) {
    throw new Error(error.message);
  }
}
