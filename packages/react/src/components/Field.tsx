import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../util.js";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cx("sk-input", className)} {...rest} />;
  },
);

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  /** Helper text under the input. */
  help?: ReactNode;
  /** Error text; also marks the input invalid. Replaces `help` when set. */
  error?: ReactNode;
  /** Class for the wrapping .sk-field. */
  fieldClassName?: string;
}

/** Labelled input with help/error text, wired up for assistive tech. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, help, error, id, fieldClassName, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const noteId = `${inputId}-note`;
  const note = error ?? help;
  return (
    <div className={cx("sk-field", fieldClassName)}>
      <label className="sk-field-label" htmlFor={inputId}>
        {label}
      </label>
      <Input
        ref={ref}
        id={inputId}
        aria-invalid={error != null || undefined}
        aria-describedby={note != null ? noteId : undefined}
        {...rest}
      />
      {note != null && (
        <span id={noteId} className={cx("sk-field-help", error != null && "sk-field-error")}>
          {note}
        </span>
      )}
    </div>
  );
});
