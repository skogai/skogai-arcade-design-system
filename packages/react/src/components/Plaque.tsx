import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../util.js";

export type PlaqueTone = "primary" | "violet" | "cyan" | "green";

export interface PlaqueProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  value: ReactNode;
  /** `primary` follows the active cabinet. Default: "primary". */
  tone?: PlaqueTone;
}

/** HUD readout: inset CRT bevel, label above a glowing value. */
export const Plaque = forwardRef<HTMLDivElement, PlaqueProps>(function Plaque(
  { label, value, tone = "primary", className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-plaque", `sk-plaque-${tone}`, className)} {...rest}>
      <span className="sk-plaque-label">{label}</span>
      <span className="sk-plaque-value">{value}</span>
    </div>
  );
});
