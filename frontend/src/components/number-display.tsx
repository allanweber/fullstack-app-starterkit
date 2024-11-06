import { currencyFormatter, numberFormatter, percentFormatter } from "@/lib/number";

type Props = {
  children: number | undefined | null;
  currency?: string;
  isPercentage?: boolean;
  withSign?: boolean;
  className?: string;
};

export default function NumberDisplay(props: Props) {
  const { children, currency, isPercentage, withSign, className } = props;
  let sign = undefined;
  let formattedValue = undefined;

  if (withSign) {
    if (children && children > 0) {
      sign = "+";
    } else if (children && children < 0) {
      sign = "-";
    }
  }

  if (children !== undefined && children !== null) {
    if (isPercentage) {
      formattedValue = percentFormatter(children);
    } else if (currency) {
      formattedValue = currencyFormatter(children, currency);
    } else {
      formattedValue = numberFormatter(children);
    }

    if (withSign) {
      formattedValue = `${sign} ${formattedValue}`;
    }
  } else {
    formattedValue = "N/A";
  }

  return <span className={className}>{formattedValue}</span>;
}
