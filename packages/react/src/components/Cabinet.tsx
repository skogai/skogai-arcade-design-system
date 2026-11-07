import { createContext, forwardRef, useContext, type HTMLAttributes } from "react";
import type { CabinetId } from "@skogai/arcade-tokens";
import { cx } from "../util.js";

const CabinetContext = createContext<CabinetId | undefined>(undefined);

/** The cabinet the nearest <Cabinet> ancestor set, or undefined for the base theme. */
export function useCabinet(): CabinetId | undefined {
  return useContext(CabinetContext);
}

export interface CabinetProps extends HTMLAttributes<HTMLDivElement> {
  /** Sub-brand theme for this subtree. Omit for the base (magenta) theme. */
  cabinet?: CabinetId;
  /** Paint the cabinet canvas (background + base type) on this element. */
  surface?: boolean;
}

/**
 * Scopes a subtree to one cabinet. Every token, and therefore every
 * component inside, retints. Never nest two different cabinets on one screen.
 */
export const Cabinet = forwardRef<HTMLDivElement, CabinetProps>(function Cabinet(
  { cabinet, surface, className, children, ...rest },
  ref,
) {
  return (
    <CabinetContext.Provider value={cabinet}>
      <div ref={ref} data-cabinet={cabinet} className={cx(surface && "sk-app", className)} {...rest}>
        {children}
      </div>
    </CabinetContext.Provider>
  );
});
