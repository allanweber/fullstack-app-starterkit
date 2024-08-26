import { render } from '@react-email/components';
import { AccountActivation } from './AccountActivation';

import { Resend } from 'resend';
import env from '../../env';

const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

export async function sendActivationEmail(email: string, token: string) {
  const subject = 'Activate your account';
  const emailHtml = await render(AccountActivation({ token }));
  await sendEmail(email, subject, emailHtml);
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
