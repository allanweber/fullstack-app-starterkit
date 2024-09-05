import { Icons } from "@/components/Icons";
import { Switch } from "@/components/Switch";
import { Button } from "@/components/ui/button";
import { useGoogleSignIn } from "@/services/authentication";

export enum SignKind {
  SIGNIN = "signin",
  SIGNUP = "signup",
}

export default function GoogleSigninButton({ kind }: { kind: SignKind }) {
  const googleSignIn = useGoogleSignIn();

  function signin() {
    googleSignIn.mutate(undefined, {
      onSuccess: ({ url }) => {
        window.location.href = url;
      },
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signin()}
      disabled={googleSignIn.isPending}
    >
      <Icons.Google className="stroke-white mr-2 h-5 w-5" />
      <Switch condition={kind}>
        <Switch.Case when={SignKind.SIGNIN}>Sign in with Google</Switch.Case>
        <Switch.Case when={SignKind.SIGNUP}>Sign up with Google</Switch.Case>
      </Switch>
    </Button>
  );
}
