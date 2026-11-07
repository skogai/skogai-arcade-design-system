import { forwardRef, type SVGAttributes } from "react";
import { iconRects, type IconName } from "../icons.generated.js";
import { cx } from "../util.js";

export type IconSize = 16 | 24 | 32 | 40;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  name: IconName;
  /** Snaps to the pixel grid. Default 24. */
  size?: IconSize;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  title?: string;
}

/** Pixel glyph drawn on a 16×16 grid; fill follows currentColor. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 24, title, className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      className={cx("sk-icon", size !== 24 && `sk-icon-${size}`, className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {iconRects[name].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} />
      ))}
    </svg>
  );
});
