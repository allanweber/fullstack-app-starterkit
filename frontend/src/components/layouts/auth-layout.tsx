import { Package } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <Package className="h-6 w-6 transition-all group-hover:scale-110" />
          <span>Acme Inc</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Some quote about the product or service goes here. Some quote about the product or
              service goes here.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="px-0 sm:px-8">
          <Outlet />
        </div>
        <p className="text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};
