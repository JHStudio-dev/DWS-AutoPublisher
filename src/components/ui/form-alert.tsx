import type { FormState } from "@/lib/errors";

export function FormAlert({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const isError = state.status === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={
        isError
          ? "dws-alert dws-alert--error rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-text"
          : "dws-alert dws-alert--success rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-text"
      }
    >
      {state.message}
    </div>
  );
}
