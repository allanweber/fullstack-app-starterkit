import { Button } from '@/components/ui/button';
import {
  useNewRegistrationCode,
  useVerifyRegistration,
} from '../../services/authentication';

import { MessageDisplay } from '@/components/message-display';
import { Switch } from '@/components/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const verificationSchema = z.object({
  code: z.string().min(6),
});

const newCodeSchema = z.object({
  email: z.string().email(),
});

type Verification = z.infer<typeof verificationSchema>;
type NewCode = z.infer<typeof newCodeSchema>;

enum Steps {
  VERIFICATION,
  NEW_CODE,
  CODE_ACCEPTED,
}

function VerificationForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useVerifyRegistration();

  const form = useForm<Verification>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
    mode: 'all',
  });

  function onSubmit(data: Verification) {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex flex-col gap-2 mx-auto w-80 items-center">
                <FormLabel>Code</FormLabel>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || !form.formState.isValid}
        >
          Continue
        </Button>
        <MessageDisplay message={mutation.error} variant="destructive" />
      </form>
    </Form>
  );
}

function NewCodeForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useNewRegistrationCode();

  const form = useForm<NewCode>({
    resolver: zodResolver(newCodeSchema),
    defaultValues: {
      email: '',
    },
    mode: 'all',
  });

  function onSubmit(data: NewCode) {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Email</FormLabel>
              <Input placeholder="email@mail.com" type="email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || !form.formState.isValid}
        >
          Continue
        </Button>
        <MessageDisplay message={mutation.error} variant="destructive" />
      </form>
    </Form>
  );
}

export default function VerifyRegistration() {
  const [step, setStep] = useState(Steps.VERIFICATION);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Registration</CardTitle>
        <CardDescription>
          <Switch condition={step}>
            <Switch.Case when={Steps.NEW_CODE}>
              Enter your email below to receive a new code
            </Switch.Case>
            <Switch.Case when={Steps.VERIFICATION}>
              Enter the code sent to your email
            </Switch.Case>
            <Switch.Case when={Steps.CODE_ACCEPTED}>
              Your account has been verified!
            </Switch.Case>
          </Switch>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Switch condition={step}>
          <Switch.Case when={Steps.NEW_CODE}>
            <>
              <NewCodeForm onSuccess={() => setStep(Steps.VERIFICATION)} />
              <div className="mt-4 text-center text-sm">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(Steps.VERIFICATION)}
                >
                  I have a code
                </Button>
              </div>
            </>
          </Switch.Case>
          <Switch.Case when={Steps.VERIFICATION}>
            <>
              <VerificationForm
                onSuccess={() => setStep(Steps.CODE_ACCEPTED)}
              />
              <div className="mt-4 text-center text-sm">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(Steps.NEW_CODE)}
                >
                  Send me a new code
                </Button>
              </div>
            </>
          </Switch.Case>
          <Switch.Case when={Steps.CODE_ACCEPTED}>
            <>
              <Button asChild type="button" className="w-full">
                <Link to="/login">Sign in</Link>
              </Button>
            </>
          </Switch.Case>
        </Switch>
      </CardContent>
    </Card>
  );
}
