import {
  Children,
  forwardRef,
  isValidElement,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
} from "react";
import { cx } from "../util.js";
import { fanPosition } from "./PlayingCard.js";

/* ---- Fans & hands ------------------------------------------------------- */

export interface FanProps extends HTMLAttributes<HTMLDivElement> {
  /** `hand` for the player's cards, `ai` for a face-down opponent seat. */
  variant?: "hand" | "ai";
  /** Tighter overlap, for 11–12 card hands (`hand`) or 11 card seats (`ai`). */
  tight?: boolean;
  /** Total rotation in degrees. Defaults: 20 (hand) / -12 (ai). */
  spread?: number;
  /** Vertical drop at the ends, in px. Defaults: 18 (hand) / -6 (ai). */
  lift?: number;
}

/** Overlapping fan of cards. Each child is placed along the fan curve. */
export const Fan = forwardRef<HTMLDivElement, FanProps>(function Fan(
  { variant = "hand", tight, spread, lift, className, children, ...rest },
  ref,
) {
  const s = spread ?? (variant === "ai" ? -12 : 20);
  const l = lift ?? (variant === "ai" ? -6 : 18);
  const items = Children.toArray(children);
  const fan = (
    <div
      ref={ref}
      className={cx(
        "sk-fan",
        variant === "ai" ? "sk-fan-ai" : "sk-hand",
        tight && (variant === "ai" ? "sk-fan-ai-tight" : "sk-hand-tight"),
        className,
      )}
      {...rest}
    >
      {items.map((child, i) => {
        const { rot, dy } = fanPosition(i, items.length, s, l);
        return (
          <div
            key={isValidElement(child) && child.key != null ? child.key : i}
            style={{ "--rot": rot, "--dy": dy, "--i": i } as CSSProperties}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
  return variant === "hand" ? <div className="sk-hand-scroll">{fan}</div> : fan;
});

export interface HandCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lifted, as when the card is picked to play. */
  raised?: boolean;
}

/** Focusable button wrapper that lifts its card on hover / focus. */
export const HandCard = forwardRef<HTMLButtonElement, HandCardProps>(function HandCard(
  { raised, className, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx("sk-hand-card", onClick && "is-pickable", raised && "is-raised", className)}
      onClick={onClick}
      {...rest}
    />
  );
});

/* ---- Piles, felt, seats ------------------------------------------------- */

export interface PileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visible caption under the pile, e.g. "STOCK · 31". */
  label?: ReactNode;
  /** Cards stacked inside the dashed drop target; position them absolutely. */
  children?: ReactNode;
  "aria-label": string;
}

export const Pile = forwardRef<HTMLButtonElement, PileProps>(function Pile(
  { label, children, className, ...rest },
  ref,
) {
  return (
    <div className="sk-pile-col">
      <button ref={ref} type="button" className={cx("sk-pile", className)} {...rest}>
        {children}
      </button>
      {label != null && <span className="sk-label sk-pile-label">{label}</span>}
    </div>
  );
});

/** Column that centres a labelled group (seat + fan, pile + caption, hand + legend). */
export const PileColumn = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function PileColumn({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("sk-pile-col", className)} {...rest} />;
  },
);

export interface FeltProps extends HTMLAttributes<HTMLDivElement> {
  dashed?: boolean;
}

/** The table surface: inset panel for piles, trick area or free play. */
export const Felt = forwardRef<HTMLDivElement, FeltProps>(function Felt(
  { dashed, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(dashed ? "sk-felt-dashed" : "sk-felt", className)} {...rest} />;
});

export interface SeatProps extends HTMLAttributes<HTMLDivElement> {
  name: ReactNode;
  /** Status badge shown before the name. */
  badge?: ReactNode;
  /** Right-aligned mono count, e.g. "10 cards". */
  count?: ReactNode;
}

export const Seat = forwardRef<HTMLDivElement, SeatProps>(function Seat(
  { name, badge, count, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("sk-seat", className)} {...rest}>
      {badge}
      <span className="sk-h4">{name}</span>
      {count != null && <span className="sk-seat-count">{count}</span>}
    </div>
  );
});

/* ---- Page chrome -------------------------------------------------------- */

/** Full-height table page: header, `TableMain`, `TableFooter`. */
export const TablePage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TablePage({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("sk-table-page", className)} {...rest} />;
  },
);

export const TableMain = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function TableMain(
  { className, ...rest },
  ref,
) {
  return <main ref={ref} className={cx("sk-table-main", className)} {...rest} />;
});

/** Bottom action bar. Put `Button`s inside; use `TableFooterSep` between groups. */
export const TableFooter = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function TableFooter({ className, ...rest }, ref) {
    return <footer ref={ref} className={cx("sk-table-footer", className)} {...rest} />;
  },
);

export const TableFooterSep = () => <span className="sk-footer-sep" aria-hidden="true" />;

export type TableMode = "gin" | "hearts" | "sandbox";

const MODES: { id: TableMode; label: string }[] = [
  { id: "gin", label: "GIN RUMMY" },
  { id: "hearts", label: "HEARTS" },
  { id: "sandbox", label: "SANDBOX" },
];

export interface TableHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  mode: TableMode;
  /** Link target for each mode tab. Defaults to `#`. */
  hrefs?: Partial<Record<TableMode, string>>;
  /** Live status line, e.g. "Your turn — draw from the stock or the discard pile." */
  status?: ReactNode;
  /** Score readout in the outlined button, e.g. "YOU 027 · AI 014". */
  score?: ReactNode;
  scoreHref?: string;
  rulesHref?: string;
  /** Card sounds on. Controlled when `soundOn` is given. */
  soundOn?: boolean;
  defaultSoundOn?: boolean;
  onSoundChange?: (on: boolean) => void;
}

const SOUND_ON = "M0 2h2v4h-2zM2 1h1v6h-1zM3 0h1v8h-1zM5 2h1v4h-1zM7 1h1v6h-1z";
const SOUND_OFF =
  "M0 2h2v4h-2zM2 1h1v6h-1zM3 0h1v8h-1zM5 2h1v1h-1zM7 2h1v1h-1zM6 3h1v2h-1zM5 5h1v1h-1zM7 5h1v1h-1z";
const SPADE = "M3 0h1v1h-1zM2 1h3v1h-3zM1 2h5v1h-5zM0 3h7v2h-7zM3 5h1v1h-1zM2 6h3v1h-3z";

/** Card Arcade table header: brand, game-mode tabs, live status, score, sound, rules. */
export const TableHeader = forwardRef<HTMLElement, TableHeaderProps>(function TableHeader(
  {
    mode,
    hrefs = {},
    status,
    score,
    scoreHref = "#",
    rulesHref = "#",
    soundOn,
    defaultSoundOn = true,
    onSoundChange,
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultSoundOn);
  const on = soundOn ?? inner;
  return (
    <header ref={ref} className={cx("sk-table-header", className)} {...rest}>
      <div className="sk-table-brand">
        <div className="sk-table-logo">
          <svg viewBox="0 0 7 7" aria-hidden="true">
            <path d={SPADE} />
          </svg>
        </div>
        <div className="sk-table-brand-text">
          <span className="sk-table-brand-name">CARD ARCADE</span>
          <span className="sk-table-brand-meta">SKOGAI · TABLE 01</span>
        </div>
      </div>
      <nav className="sk-mode-tabs" aria-label="Game mode">
        {MODES.map((m) => (
          <a
            key={m.id}
            href={hrefs[m.id] ?? "#"}
            className={cx("sk-btn", m.id === mode ? "sk-btn-primary" : "sk-btn-ghost")}
            aria-current={m.id === mode ? "page" : undefined}
          >
            {m.label}
          </a>
        ))}
      </nav>
      <p className="sk-table-status">
        <span className="sk-badge sk-badge-success sk-table-live">
          <span aria-hidden="true">▣</span>LIVE
        </span>
        <span className="sk-table-status-text">{status}</span>
      </p>
      <div className="sk-table-actions">
        {score != null && (
          <a href={scoreHref} className="sk-btn sk-btn-outline sk-table-score" aria-label="Open scoreboard">
            {score}
          </a>
        )}
        <button
          type="button"
          className="sk-btn sk-btn-ghost sk-icon-btn"
          aria-pressed={on}
          aria-label={on ? "Mute card sounds" : "Unmute card sounds"}
          onClick={() => {
            setInner(!on);
            onSoundChange?.(!on);
          }}
        >
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d={on ? SOUND_ON : SOUND_OFF} />
          </svg>
        </button>
        <a
          href={rulesHref}
          className="sk-btn sk-btn-ghost sk-icon-btn sk-display"
          style={{ fontSize: "var(--sk-text-12)" }}
          aria-label="Rules and controls"
        >
          ?
        </a>
      </div>
    </header>
  );
});

/* ---- Dialogs ------------------------------------------------------------ */

export interface DialogProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Small caps line above the title, e.g. "ROUND 04 · RESULT". */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** `announce` renders the title as the big arcade announcement. */
  titleVariant?: "heading" | "announce";
  lede?: ReactNode;
  /** Wider shell-coloured sheet used for rules. */
  wide?: boolean;
  onClose?: () => void;
  closeHref?: string;
  /** Footer actions, right-aligned. */
  actions?: ReactNode;
  titleId?: string;
}

/** Overlay sheet on the scrim: round results, rules and controls. */
export const Dialog = forwardRef<HTMLElement, DialogProps>(function Dialog(
  {
    eyebrow,
    title,
    titleVariant = "heading",
    lede,
    wide,
    onClose,
    closeHref,
    actions,
    titleId = "sk-dialog-title",
    className,
    children,
    ...rest
  },
  ref,
) {
  const closeProps = { className: "sk-btn sk-btn-ghost sk-icon-btn", "aria-label": "Close" };
  return (
    <div className="sk-dialog-scrim">
      <section
        ref={ref}
        role="dialog"
        aria-labelledby={titleId}
        className={cx("sk-dialog", wide && "sk-dialog-wide", className)}
        {...rest}
      >
        <div className="sk-dialog-head">
          <div>
            {eyebrow != null && <span className="sk-card-eyebrow">{eyebrow}</span>}
            {titleVariant === "announce" ? (
              <h1 id={titleId} className="sk-announce-title" style={{ textAlign: "left" }}>
                {title}
              </h1>
            ) : (
              <h1 id={titleId} className="sk-h3" style={{ margin: 0 }}>
                {title}
              </h1>
            )}
            {lede != null && <p className="sk-dialog-lede">{lede}</p>}
          </div>
          {closeHref ? (
            <a href={closeHref} {...closeProps}>
              ✕
            </a>
          ) : onClose ? (
            <button type="button" onClick={onClose} {...closeProps}>
              ✕
            </button>
          ) : null}
        </div>
        {children}
        {actions != null && <div className="sk-dialog-actions sk-dialog-actions-rule">{actions}</div>}
      </section>
    </div>
  );
});

/** Bulleted rules list used inside dialog cards. */
export const RuleList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  function RuleList({ className, ...rest }, ref) {
    return <ul ref={ref} className={cx("sk-rule-list", className)} {...rest} />;
  },
);

export interface ScoreTableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  caption: ReactNode;
  rows: { seat: ReactNode; score: ReactNode; lead?: boolean }[];
}

/** Two-column seat/score table, e.g. Hearts standings (lowest wins). */
export const ScoreTable = forwardRef<HTMLTableElement, ScoreTableProps>(function ScoreTable(
  { caption, rows, className, ...rest },
  ref,
) {
  return (
    <table ref={ref} className={cx("sk-score-table", className)} {...rest}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">SEAT</th>
          <th scope="col">SCORE</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.seat}</td>
            <td className={r.lead ? "is-lead" : undefined}>{r.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
