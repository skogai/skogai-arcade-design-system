import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../util.js";

export type ButtonVariant = "default" | "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` is the single hero action per screen. Default: "default". */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width. */
  block?: boolean;
  /** Glyph or <Icon> shown before the label, e.g. "▶". */
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", block, icon, type = "button", className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "sk-btn",
        variant !== "default" && `sk-btn-${variant}`,
        size !== "md" && `sk-btn-${size}`,
        block && "sk-btn-block",
        className,
      )}
      {...rest}
    >
      {icon != null && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
});
