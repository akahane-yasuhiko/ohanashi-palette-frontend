import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export function PrimaryButton({ children, onClick }: Props) {
  return (
    <button type="button" className="primary-button" onClick={onClick}>
      {children}
    </button>
  );
}
