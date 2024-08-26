import { FC, ReactElement, ReactNode } from "react";

interface CaseProps {
  children?: ReactNode;
  when: string | number;
}

interface DefaultProps {
  children?: ReactNode;
  when?: never;
}

interface SwitchComponentProps {
  condition: undefined | string | number;
  children?: ReactElement<CaseProps | DefaultProps> | ReactElement<CaseProps | DefaultProps>[];
}

interface SwitchComponentType extends FC<SwitchComponentProps> {
  Case: FC<CaseProps>;
  Default: FC<DefaultProps>;
}

export const Switch: SwitchComponentType = ({ condition, children }) => {
  if (!children) {
    return null;
  }

  const arrayOfChildren = Array.isArray(children) ? children : [children];
  const cases = arrayOfChildren.filter((child) => child.props.when == condition);
  const defaultCases = arrayOfChildren.filter((child) => !child.props.when);
  if (defaultCases.length > 1) {
    throw new Error("Only one <Switch.Default> is allowed");
  }
  const defaultCase = defaultCases[0];

  return cases.length > 0 ? <>{cases}</> : <>{defaultCase}</>;
};

Switch.Case = ({ children }) => {
  return <>{children}</>;
};

Switch.Default = ({ children }) => {
  return <>{children}</>;
};
