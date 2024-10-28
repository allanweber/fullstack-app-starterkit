import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  useRequestResetPassword,
  useResetPassword,
  useValidateResetPassword,
} from "../../services/authentication";

import { LoadingSpinner } from "@/components/LoadingSpinner ";
import { MessageDisplay } from "@/components/MessageDisplay";
import { Switch } from "@/components/Switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    token: z.string(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPassword = z.infer<typeof resetPasswordSchema>;

enum Steps {
  REQUEST,
  REQUESTED,
  TOKEN_PRESENT,
  INVALID_TOKEN,
  VALID_TOKEN,
  CHANGED,
}

function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useRequestResetPassword();
  const form = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  function onSubmit(data: ForgotPassword) {
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
          Request Password Reset
        </Button>
        <MessageDisplay message={mutation.error} variant="destructive" />
      </form>
    </Form>
  );
}

function ValidateTokenForm({
  token,
  onChange,
}: {
  token: string;
  onChange: (step: Steps) => void;
}) {
  const { data, error, isLoading } = useValidateResetPassword(token);

  useEffect(() => {
    if (data) {
      onChange(Steps.VALID_TOKEN);
    }
  }, [data, onChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center mb-3">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <MessageDisplay message={error} variant="destructive" />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onChange(Steps.REQUEST)}
        >
          Send me a new code
        </Button>
      </div>
    );
  }

  return null;
}

function ResetPasswordForm({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const mutation = useResetPassword();

  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      token: token,
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  function onSubmit(data: ResetPassword) {
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
              <Input placeholder="email@mail.com" type="email" autoComplete="email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center">
                <FormLabel>New Password</FormLabel>
              </div>
              <Input
                placeholder="password"
                type="password"
                autoComplete="new-password"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                placeholder="password"
                type="password"
                autoComplete="new-password"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || !form.formState.isValid}
        >
          Change Password
        </Button>
        <MessageDisplay message={mutation.error} variant="destructive" />
      </form>
    </Form>
  );
}

export default function ForgotPassword() {
  const [step, setStep] = useState(Steps.REQUEST);

  const [search] = useSearchParams();
  const token = search.get("token");

  useEffect(() => {
    if (token) {
      setStep(Steps.TOKEN_PRESENT);
    }
  }, [token]);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          <Switch condition={step}>
            <Switch.Case when={Steps.REQUEST}>
              Enter your email to receive a password reset link
            </Switch.Case>
            <Switch.Case when={Steps.REQUESTED}></Switch.Case>
            <Switch.Case when={Steps.TOKEN_PRESENT}>Checking token...</Switch.Case>
            <Switch.Case when={Steps.VALID_TOKEN}>Enter your new password.</Switch.Case>
            <Switch.Case when={Steps.INVALID_TOKEN}>Invalid token.</Switch.Case>
            <Switch.Case when={Steps.CHANGED}>Your password has been changed.</Switch.Case>
          </Switch>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Switch condition={step}>
          <Switch.Case when={Steps.REQUEST}>
            <ForgotPasswordForm onSuccess={() => setStep(Steps.REQUESTED)} />
          </Switch.Case>
          <Switch.Case when={Steps.REQUESTED}>
            <Alert variant="default">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                If an account with that email exists, we will send you a password reset link.
              </AlertDescription>
            </Alert>
          </Switch.Case>
          <Switch.Case when={Steps.TOKEN_PRESENT}>
            <ValidateTokenForm token={token!} onChange={(step: Steps) => setStep(step)} />
          </Switch.Case>
          <Switch.Case when={Steps.VALID_TOKEN}>
            <ResetPasswordForm token={token!} onSuccess={() => setStep(Steps.CHANGED)} />
          </Switch.Case>
          <Switch.Case when={Steps.CHANGED}>
            <div className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>Your password has been changed.</AlertDescription>
              </Alert>
              <Button asChild type="button" className="w-full">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </Switch.Case>
        </Switch>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
