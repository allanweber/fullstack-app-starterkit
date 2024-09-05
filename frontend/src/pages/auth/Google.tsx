import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { LoadingSpinner } from "@/components/LoadingSpinner ";
import { MessageDisplay } from "@/components/MessageDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleSignInCallback } from "@/services/authentication";
import { useEffect } from "react";
import GoogleSigninButton, { SignKind } from "./components/GoogleSignButton";

export function Google() {
  const googleCallback = useGoogleSignInCallback();
  const auth = useAuth();

  const [search] = useSearchParams();
  const navigate = useNavigate();

  const state = search.get("state");
  const code = search.get("code");

  useEffect(() => {
    if (code && state) {
      googleCallback.mutate(
        { state, code },
        {
          onSuccess: () => {
            console.log("Google callback success");
          },
          onError: () => {
            console.log("Google callback error");
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!code || !state) {
    return (
      <Card className="max-w-sm">
        <CardHeader></CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <MessageDisplay
            message="An error occurred while signing in with Google"
            variant="destructive"
          />
          <GoogleSigninButton kind={SignKind.SIGNIN} />
        </CardContent>
      </Card>
    );
  }

  if (googleCallback.isError) {
    return (
      <Card className="max-w-sm">
        <CardHeader></CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <MessageDisplay message={googleCallback.error} variant="destructive" />
          <GoogleSigninButton kind={SignKind.SIGNIN} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Signing with Google</CardTitle>
        <CardDescription>Wait for the magic to happen! 🎩✨</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
        {/* <div className="mt-4">
          <GoogleSigninButton kind={SignKind.SIGNIN} />
        </div>
         */}
      </CardContent>
    </Card>
  );
}
