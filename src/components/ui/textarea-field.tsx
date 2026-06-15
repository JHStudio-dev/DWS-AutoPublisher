import type { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
};

export function TextareaField({ label, name, id, ...props }: TextareaFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="dws-field">
      <label
        htmlFor={fieldId}
        className="dws-field__label block text-sm font-medium text-text"
      >
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        className="dws-field__input mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      />
    </div>
  );
}
