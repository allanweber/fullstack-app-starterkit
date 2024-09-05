import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSignUp } from "../../services/authentication";

import { MessageDisplay } from "@/components/MessageDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Register, registerSchema } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GoogleSigninButton, { SignKind } from "./components/GoogleSignButton";

const fallback = "/app" as const;

export function RegisterPage() {
  const auth = useAuth();

  const [search] = useSearchParams();
  const navigate = useNavigate();
  const redirect = search.get("redirect") || fallback;
  const mutation = useSignUp();

  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  function onSubmit(data: Register) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        if (data.enabled) {
          auth.login(data);
          navigate(redirect, { replace: true });
        } else {
          navigate("/verify-email", { replace: true });
        }
      },
    });
  }
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Password</FormLabel>
                  <Input
                    placeholder="password"
                    type="password"
                    autoComplete="current-password"
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
              Create a Account
            </Button>
            <MessageDisplay message={mutation.error} variant="destructive" />
          </form>
        </Form>
        <div className="mt-4">
          <GoogleSigninButton kind={SignKind.SIGNUP} />
        </div>
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
