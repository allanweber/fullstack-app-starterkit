import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type Props = {
  value: number;
  className?: string;
};

export default function ColoredNumber(props: PropsWithChildren<Props>) {
  const { children, value, className } = props;

  const positive = "text-green-600";
  const negative = "text-red-600";
  const positiveValue = value >= 0;

  return <span className={cn(positiveValue ? positive : negative, className)}>{children}</span>;
}
