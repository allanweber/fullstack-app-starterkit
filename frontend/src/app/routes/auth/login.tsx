import { useSignIn } from '@/app/services/authentication';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { MessageDisplay } from '@/components/message-display';
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
import { Login, loginSchema } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import GoogleSigninButton from './components/google-sign-button';

const fallback = '/app' as const;

export const LoginPage = () => {
  const auth = useAuth();

  const [search] = useSearchParams();
  const navigate = useNavigate();
  const redirect = search.get('redirect') || fallback;
  const mutation = useSignIn();

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  function onSubmit(data: Login) {
    mutation.mutate(data, {
      onSuccess: (data) => {
        auth.login(data);
        navigate(redirect);
      },
    });
  }
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
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
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input placeholder="password" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              Login
            </Button>
            <MessageDisplay message={mutation.error} variant="destructive" />
          </form>
        </Form>
        <div className="mt-4">
          <GoogleSigninButton />
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
