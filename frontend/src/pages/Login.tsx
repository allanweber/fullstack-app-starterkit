import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSignIn } from '../services/authentication';

const fallback = '/dashboard' as const;

export function Login() {
  const auth = useAuth();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search] = useSearchParams();
  const redirect = search.get('redirect') || fallback;
  const loginMutation = useSignIn();

  const onFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);

    evt.preventDefault();
    const data = new FormData(evt.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) return;

    loginMutation.mutate(
      {
        email: email as string,
        password: password as string,
      },
      {
        onSuccess: (data) => {
          auth.login(data);
          navigate(redirect);
        },
        onError: (error) => {
          auth.logout();
          alert('Error logging in: ' + error.message);
        },
      }
    );
    setIsSubmitting(false);
  };

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      {redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
        <fieldset disabled={isSubmitting} className="w-full grid gap-2">
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="username-input" className="text-sm font-medium">
              Email
            </label>
            <input
              id="username-input"
              name="email"
              placeholder="Enter your email"
              type="email"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password-input"
              name="password"
              placeholder="Enter your password"
              type="password"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
