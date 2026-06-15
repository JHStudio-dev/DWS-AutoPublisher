import type { SelectHTMLAttributes } from "react";

type SelectOption = { value: string; label: string };

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
};

export function SelectField({
  label,
  name,
  id,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="dws-field">
      <label
        htmlFor={fieldId}
        className="dws-field__label block text-sm font-medium text-text"
      >
        {label}
      </label>
      <select
        id={fieldId}
        name={name}
        className="dws-field__input mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
