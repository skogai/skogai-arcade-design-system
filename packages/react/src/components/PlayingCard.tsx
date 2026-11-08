import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../util.js";

export type Suit = "spades" | "hearts" | "clubs" | "diamonds";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
/** Meld / selection ring: set (green), run (cyan), pass (magenta), dim (unplayable). */
export type CardGlow = "none" | "set" | "run" | "pass" | "dim";

export const suits: readonly Suit[] = ["spades", "hearts", "clubs", "diamonds"];

const SUIT_PATHS: Record<Suit, { d: string; viewBox: string; glyph: string }> = {
  hearts: {
    d: "M1 0h2v1h-2zM4 0h2v1h-2zM0 1h7v2h-7zM1 3h5v1h-5zM2 4h3v1h-3zM3 5h1v1h-1z",
    viewBox: "0 -0.5 7 7",
    glyph: "♥",
  },
  diamonds: {
    d: "M3 0h1v1h-1zM2 1h3v1h-3zM1 2h5v1h-5zM0 3h7v1h-7zM1 4h5v1h-5zM2 5h3v1h-3zM3 6h1v1h-1z",
    viewBox: "0 0 7 7",
    glyph: "♦",
  },
  spades: {
    d: "M3 0h1v1h-1zM2 1h3v1h-3zM1 2h5v1h-5zM0 3h7v2h-7zM3 5h1v1h-1zM2 6h3v1h-3z",
    viewBox: "0 0 7 7",
    glyph: "♠",
  },
  clubs: {
    d: "M2 0h3v2h-3zM0 2h7v2h-7zM0 4h2v1h-2zM3 4h1v1h-1zM5 4h2v1h-2zM3 5h1v1h-1zM2 6h3v1h-3z",
    viewBox: "0 0 7 7",
    glyph: "♣",
  },
};

const COURT: Partial<Record<Rank, string>> = { A: "ACE", J: "JACK", Q: "QUEEN", K: "KING" };
const NAMES: Partial<Record<Rank, string>> = { A: "Ace", J: "Jack", Q: "Queen", K: "King" };

/** "7" + "hearts" → "7 of hearts"; "K" → "King of …". */
export function cardName(rank: Rank, suit: Suit): string {
  return `${NAMES[rank] ?? rank} of ${suit}`;
}

/** The suit's glyph character, e.g. "♥". */
export function suitGlyph(suit: Suit): string {
  return SUIT_PATHS[suit].glyph;
}

/**
 * Fan curve for card `i` of `n`: `spread` is the total rotation in degrees,
 * `lift` the vertical drop in px at the ends (negative arcs the other way).
 */
export function fanPosition(i: number, n: number, spread: number, lift: number) {
  const norm = n > 1 ? i / (n - 1) - 0.5 : 0;
  return { rot: +(norm * spread).toFixed(2), dy: Math.round((norm * 2) ** 2 * lift) };
}

function SuitIcon({ suit, label }: { suit: Suit; label?: string }) {
  const s = SUIT_PATHS[suit];
  return (
    <svg
      viewBox={s.viewBox}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path d={s.d} />
    </svg>
  );
}

export interface PlayingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  rank?: Rank;
  suit?: Suit;
  /** Show the back instead of the face. */
  faceDown?: boolean;
  /** `sm` is the 72×102 size used for AI seats and result dialogs. */
  size?: "md" | "sm";
  glow?: CardGlow;
}

/** Flat CRT-black playing card with pixel suit glyphs, or its checkered back. */
export const PlayingCard = forwardRef<HTMLDivElement, PlayingCardProps>(function PlayingCard(
  { rank = "A", suit = "spades", faceDown = false, size = "md", glow = "none", className, ...rest },
  ref,
) {
  const common = {
    ref,
    className: cx("sk-playing-card", size === "sm" && "sk-playing-card-sm", className),
    "data-glow": glow === "none" ? undefined : glow,
    ...rest,
  };
  if (faceDown) {
    return (
      <div {...common} data-face-down="">
        <div className="sk-card-back">
          <div className="sk-card-back-inner">
            <span className="sk-card-back-tile" aria-hidden="true" />
            <div className="sk-card-emblem">
              <SuitIcon suit="diamonds" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const court = COURT[rank];
  return (
    <div {...common} data-rank={rank} data-suit={suit}>
      <div className="sk-card-face">
        <div className="sk-card-index">
          <span className="sk-card-rank">{rank}</span>
          <SuitIcon suit={suit} label={suit} />
        </div>
        <div className="sk-card-center">
          {court ? (
            <div className="sk-card-court">
              <span className="sk-card-court-label">{court}</span>
              <SuitIcon suit={suit} />
            </div>
          ) : (
            <SuitIcon suit={suit} />
          )}
        </div>
        <div className="sk-card-index sk-card-index-end">
          <span className="sk-card-rank">{rank}</span>
          <SuitIcon suit={suit} />
        </div>
      </div>
    </div>
  );
});
