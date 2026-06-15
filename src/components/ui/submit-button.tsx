"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  fullWidth?: boolean;
};

export function SubmitButton({
  children,
  pendingLabel = "Procesando…",
  fullWidth = true,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`dws-button dws-button--primary rounded-md bg-primary px-4 py-2 font-medium text-text transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60${fullWidth ? " w-full" : ""}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
