import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import { clamp, cx } from "../util.js";

type DivProps = HTMLAttributes<HTMLDivElement>;

const div = (base: string, name: string) => {
  const C = forwardRef<HTMLDivElement, DivProps>(({ className, ...rest }, ref) => (
    <div ref={ref} className={cx(base, className)} {...rest} />
  ));
  C.displayName = name;
  return C;
};

/** Outer HUD chassis. Put data-cabinet here or on an ancestor (<Cabinet>). */
export const Hud = div("sk-hud", "Hud");

export interface FrameProps extends DivProps {
  /** Grow to fill remaining space in a <HudFoot>. */
  grow?: boolean;
}

/** Double-stroke bracket box — the defining frame gesture. */
export const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame(
  { grow, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("sk-frame", grow && "grow", className)} {...rest} />;
});

/** Status header row: avatar · brand · stats. Already framed. */
export const HudBar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function HudBar(
  { className, ...rest },
  ref,
) {
  return <header ref={ref} className={cx("sk-frame", "sk-hud-bar", className)} {...rest} />;
});

export const HudAvatar = div("sk-hud-avatar", "HudAvatar");

export interface HudBrandProps extends DivProps {
  /** Small tagline under the lockup, e.g. "▸ CITY-FOREST LINK". */
  tagline?: ReactNode;
}

export const HudBrand = forwardRef<HTMLDivElement, HudBrandProps>(function HudBrand(
  { tagline, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-hud-brand", className)} {...rest}>
      <span>{children}</span>
      {tagline != null && <small>{tagline}</small>}
    </div>
  );
});

export const HudStats = div("sk-hud-stats", "HudStats");

export interface StatProps extends Omit<DivProps, "children"> {
  label: ReactNode;
  /** Middle slot: <Hearts>, <Meter>, or nothing. */
  gauge?: ReactNode;
  value?: ReactNode;
  valueClassName?: string;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, gauge, value, valueClassName, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-stat", className)} {...rest}>
      <span className="sk-stat-label">{label}</span>
      {gauge ?? <span />}
      <span className={cx("sk-stat-value", valueClassName)}>{value}</span>
    </div>
  );
});

export interface GaugeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  max: number;
  /** Accessible name, e.g. "HP". */
  label?: string;
}

/** Pixel HP row. */
export const Hearts = forwardRef<HTMLSpanElement, GaugeProps>(function Hearts(
  { value, max, label = "HP", className, ...rest },
  ref,
) {
  const filled = clamp(Math.round(value), 0, max);
  return (
    <span
      ref={ref}
      role="img"
      aria-label={`${label} ${filled} of ${max}`}
      className={cx("sk-hearts", className)}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < filled ? undefined : "empty"} />
      ))}
    </span>
  );
});

export interface MeterProps extends Omit<GaugeProps, "max"> {
  /** 0–`max`. */
  max?: number;
  /** Number of blocks drawn. Default 7. */
  segments?: number;
}

/** Blocky segment meter — never a smooth bar. */
export const Meter = forwardRef<HTMLSpanElement, MeterProps>(function Meter(
  { value, max = 100, segments = 7, label, className, ...rest },
  ref,
) {
  const v = clamp(value, 0, max);
  const lit = Math.round((v / max) * segments);
  return (
    <span
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={v}
      className={cx("sk-meter", className)}
      {...rest}
    >
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} className={i < lit ? undefined : "empty"} />
      ))}
    </span>
  );
});

export interface HudStageProps extends DivProps {
  size?: "short" | "default" | "tall";
  /** Scene art; cropped to the stage, never sizes it. */
  image?: ImgHTMLAttributes<HTMLImageElement>;
}

export const HudStage = forwardRef<HTMLDivElement, HudStageProps>(function HudStage(
  { size = "default", image, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("sk-hud-stage", size !== "default" && `sk-hud-stage-${size}`, className)}
      {...rest}
    >
      {image && <img alt="" {...image} />}
      {children}
    </div>
  );
});

export interface AnnounceProps extends Omit<DivProps, "title"> {
  title: ReactNode;
  sub?: ReactNode;
  titleClassName?: string;
}

/** The one dominant headline on a screen. */
export const Announce = forwardRef<HTMLDivElement, AnnounceProps>(function Announce(
  { title, sub, titleClassName, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-frame", "sk-announce", className)} {...rest}>
      <h2 className={cx("sk-announce-title", titleClassName)}>{title}</h2>
      {sub != null && <p className="sk-announce-sub">{sub}</p>}
    </div>
  );
});

export interface DialogueProps extends DivProps {
  /** Speaker name, e.g. "ELDER OAK". */
  name: ReactNode;
  /** Portrait tile content: glyph, initials or <Icon size={40}>. */
  portrait?: ReactNode;
}

/** Mascot dialogue plaque. Children are the spoken line(s). */
export const Dialogue = forwardRef<HTMLDivElement, DialogueProps>(function Dialogue(
  { name, portrait, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-frame", "sk-dialogue", className)} {...rest}>
      <div className="sk-dialogue-portrait" aria-hidden="true">
        {portrait}
      </div>
      <div>
        <div className="sk-dialogue-name">{name}</div>
        <p className="sk-dialogue-text">{children}</p>
      </div>
    </div>
  );
});

/** Footer strip of <Frame> cells (quest / rank row). */
export const HudFoot = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function HudFoot(
  { className, ...rest },
  ref,
) {
  return <footer ref={ref} className={cx("sk-hud-foot", className)} {...rest} />;
});
