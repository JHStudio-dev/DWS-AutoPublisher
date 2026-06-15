import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export function TextField({ label, name, id, ...props }: TextFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="dws-field">
      <label
        htmlFor={fieldId}
        className="dws-field__label block text-sm font-medium text-text"
      >
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        className="dws-field__input mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      />
    </div>
  );
}
