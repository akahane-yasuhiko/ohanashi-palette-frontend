import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Screen({ children }: Props) {
  return <div className="screen">{children}</div>;
}
