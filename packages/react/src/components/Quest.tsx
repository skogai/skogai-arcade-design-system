import {
  Children,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { clamp, cx } from "../util.js";

export interface QuestStripProps extends HTMLAttributes<HTMLUListElement> {
  /** Column count. Defaults to the number of quests (the system calls for 2–4). */
  columns?: number;
}

/** The signature bottom mission rail. Children should be <Quest> items. */
export const QuestStrip = forwardRef<HTMLUListElement, QuestStripProps>(function QuestStrip(
  { columns, className, style, children, ...rest },
  ref,
) {
  const cols = columns ?? clamp(Children.count(children), 1, 4);
  return (
    <ul
      ref={ref}
      className={cx("sk-quest-strip", className)}
      style={{ "--sk-quest-cols": cols, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </ul>
  );
});

export type QuestStatus = "idle" | "active" | "done" | "locked";

export interface QuestProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  /** Short metadata line under the title, e.g. "3/5 · 120 XP". */
  meta?: ReactNode;
  /** Icon tile content: a glyph like "⚡" or an <Icon>. */
  icon?: ReactNode;
  status?: QuestStatus;
  /** 0–100. Renders the progress bar when set. */
  progress?: number;
}

export const Quest = forwardRef<HTMLLIElement, QuestProps>(function Quest(
  { title, meta, icon, status = "idle", progress, className, ...rest },
  ref,
) {
  const pct = progress == null ? undefined : clamp(progress, 0, 100);
  return (
    <li
      ref={ref}
      className={cx("sk-quest", status !== "idle" && `sk-quest-${status}`, className)}
      aria-disabled={status === "locked" || undefined}
      {...rest}
    >
      <div className="sk-quest-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className="sk-quest-title">{title}</div>
        {pct != null && (
          <div
            className="sk-quest-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div style={{ width: `${pct}%` }} />
          </div>
        )}
        {meta != null && <div className="sk-quest-meta">{meta}</div>}
      </div>
    </li>
  );
});
