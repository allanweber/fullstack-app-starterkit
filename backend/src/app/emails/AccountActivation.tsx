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
import * as React from 'react';
import env from '../../env';

const BASE_URL = env.HOST_NAME;
const APP_NAME = env.APP_NAME;

export function AccountActivation({ token }: { token: string }) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Tailwind>
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
                Use the code below to verify your email address
              </Text>

              <Text className="text-3xl">{token}</Text>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center text-center">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
