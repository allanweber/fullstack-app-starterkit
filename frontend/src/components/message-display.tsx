import { AlertCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = {
  message: any;
  title?: string;
  variant?: "default" | "destructive";
};

export function MessageDisplay({ message, title, variant = "default" }: Props) {
  if (!message) return null;
  let alertTitle = title;
  if (!alertTitle) {
    alertTitle = variant === "destructive" ? "An error occurred" : "Heads up!";
  }

  return (
    <Alert variant={variant}>
      {variant === "destructive" ? <AlertCircle size={16} /> : <Terminal size={16} />}
      <AlertTitle>{alertTitle}</AlertTitle>

      <AlertDescription>{message["message"] ?? message}</AlertDescription>
    </Alert>
  );
}
