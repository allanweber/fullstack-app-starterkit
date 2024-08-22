import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Ops</CardTitle>
        <CardDescription>
          {children || `The page you are looking for does not exist.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => window.history.back()} variant="outline" className="w-1/3">
            Go back
          </Button>
          <Button asChild className="w-1/3 ml-auto">
            <Link to="/">Start Over</Link>
          </Button>
        </div>
      </CardContent>

      <div className="space-y-2 p-2">
        <p className="flex items-center gap-2 flex-wrap"></p>
      </div>
    </Card>
  );
}
