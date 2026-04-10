import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ children, onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
