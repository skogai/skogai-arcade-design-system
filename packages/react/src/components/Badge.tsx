import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../util.js";

export type BadgeTone = "primary" | "accent" | "cyan" | "success" | "warning" | "danger" | "muted";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Arcade glyph prefix, e.g. "▣". Status color is always paired with a label. */
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "primary", icon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("sk-badge", `sk-badge-${tone}`, className)} {...rest}>
      {icon != null && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
});
