import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import React from 'react';
import env from '../../env';

const BASE_URL = env.HOST_NAME;
const APP_NAME = env.APP_NAME;

type ContactConfirmationProps = {
  name: string;
  email: string;
  message: string;
};

export default function ContactConfirmation({
  name,
  email,
  message,
}: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your message</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/logo.svg`}
                  width="58"
                  height="58"
                  alt={APP_NAME}
                  className="my-0 mx-auto"
                />
                <Text className="text-black font-medium text-[24px] leading-[32px] mt-[16px] text-center">
                  {APP_NAME}
                </Text>
              </Section>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">
                  Thank you for contacting us {name}
                </Text>

                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">
                  We received your message and will get back to you as soon as
                  possible at {email}.
                </Text>

                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">
                  Your message: {message}
                </Text>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center text-center">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}
