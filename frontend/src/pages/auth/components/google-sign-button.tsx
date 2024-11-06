import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useGoogleSignIn } from '@/services/authentication';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useSearchParams } from 'react-router-dom';

const fallback = '/app' as const;

export default function GoogleSigninButton() {
  const auth = useAuth();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const redirect = search.get('redirect') || fallback;

  const { toast } = useToast();
  const mutation = useGoogleSignIn();
  return (
    <GoogleLogin
      useOneTap={true}
      width={334}
      theme="filled_blue"
      onSuccess={(credentialResponse) => {
        mutation.mutate(
          { code: credentialResponse.credential! },
          {
            onSuccess: (data) => {
              auth.login(data);
              navigate(redirect);
            },
            onError: (error) => {
              toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: error.message,
              });
            },
          },
        );
      }}
      onError={() => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Please try again later.',
        });
      }}
    />
  );
}
