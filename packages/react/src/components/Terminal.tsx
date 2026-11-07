import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../util.js";

/** Simple CRT output block (<pre>). */
export const TerminalBlock = forwardRef<HTMLPreElement, HTMLAttributes<HTMLPreElement>>(
  function TerminalBlock({ className, ...rest }, ref) {
    return <pre ref={ref} className={cx("sk-terminal-block", className)} {...rest} />;
  },
);

export interface TerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Window title; renders the title bar when set. */
  title?: ReactNode;
  /** Right-aligned path in the title bar, e.g. "~/quests/03". */
  path?: ReactNode;
  /** Status bar content (use <TerminalSegment>). */
  status?: ReactNode;
  /** Composer row (use <TerminalComposer>). */
  composer?: ReactNode;
  scanlines?: boolean;
}

/** Terminal window: title bar · scrolling body · composer · status bar. */
export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(function Terminal(
  { title, path, status, composer, scanlines, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("skt-window", className)} {...rest}>
      {title != null || path != null ? (
        <div className="skt-titlebar">
          <span className="skt-dots" aria-hidden="true">
            <i className="skt-dot r" />
            <i className="skt-dot y" />
            <i className="skt-dot g" />
          </span>
          {title != null && <span className="skt-name">{title}</span>}
          {path != null && <span className="skt-path">{path}</span>}
        </div>
      ) : (
        <div />
      )}
      <div
        className={cx("skt-body", scanlines && "skt-scanlines")}
        role="log"
        aria-live="polite"
      >
        {children}
      </div>
      <div>
        {composer}
        {status != null && <div className="skt-statusbar">{status}</div>}
      </div>
    </div>
  );
});

export type LineKind = "in" | "out" | "ok" | "info" | "warn" | "err" | "dim";

export interface TerminalLineProps extends HTMLAttributes<HTMLSpanElement> {
  kind?: LineKind;
  /** Prompt shown before an input line, e.g. "skogai@arcade:~$". */
  prompt?: ReactNode;
}

export const TerminalLine = forwardRef<HTMLSpanElement, TerminalLineProps>(function TerminalLine(
  { kind = "out", prompt, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("skt-line", className)} {...rest}>
      {prompt != null && <Prompt>{prompt}</Prompt>}
      <span className={`skt-${kind}`}>{children}</span>
    </span>
  );
});

export type PromptTone = "primary" | "cyan" | "violet" | "yellow";

export interface PromptProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PromptTone;
}

export const Prompt = forwardRef<HTMLSpanElement, PromptProps>(function Prompt(
  { tone = "primary", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx("skt-prompt", tone !== "primary" && `skt-prompt-${tone}`, className)}
      {...rest}
    />
  );
});

export interface CursorProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: "block" | "bar" | "underline";
  blink?: boolean;
}

export const Cursor = forwardRef<HTMLSpanElement, CursorProps>(function Cursor(
  { shape = "block", blink = true, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx("skt-cursor", shape !== "block" && shape, !blink && "solid", className)}
      {...rest}
    />
  );
});

export type TagTone = "ok" | "info" | "warn" | "err";

export const TerminalTag = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { tone: TagTone }>(
  function TerminalTag({ tone, className, ...rest }, ref) {
    return <span ref={ref} className={cx("skt-tag", tone, className)} {...rest} />;
  },
);

export interface TerminalSegmentProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "ok" | "warn" | "err";
  /** Push following segments to the right edge. */
  spacer?: boolean;
}

export const TerminalSegment = forwardRef<HTMLSpanElement, TerminalSegmentProps>(
  function TerminalSegment({ tone, spacer, className, ...rest }, ref) {
    if (spacer) return <span ref={ref} className="skt-spacer" {...rest} />;
    return <span ref={ref} className={cx("skt-seg", tone, className)} {...rest} />;
  },
);

export interface TerminalComposerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prompt?: ReactNode;
  promptTone?: PromptTone;
  /** Accessible label for the input. */
  label?: string;
}

/** Single-line input row with a prompt. */
export const TerminalComposer = forwardRef<HTMLInputElement, TerminalComposerProps>(
  function TerminalComposer(
    { prompt = "›", promptTone, label = "Command", className, type = "text", ...rest },
    ref,
  ) {
    return (
      <div className={cx("skt-composer", className)}>
        <Prompt tone={promptTone} aria-hidden="true">
          {prompt}
        </Prompt>
        <input ref={ref} type={type} aria-label={label} spellCheck={false} autoComplete="off" {...rest} />
      </div>
    );
  },
);
