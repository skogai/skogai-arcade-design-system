import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../util.js";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `raised` for hover/selected/dialog clusters; `default` otherwise. */
  variant?: "default" | "raised";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("sk-card", `sk-card-${variant}`, className)} {...rest} />;
});

export const CardEyebrow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardEyebrow({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("sk-card-eyebrow", className)} {...rest} />;
  },
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Tag = "h3", className, ...rest },
  ref,
) {
  return <Tag ref={ref} className={cx("sk-card-title", className)} {...rest} />;
});

export const CardBody = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardBody({ className, ...rest }, ref) {
    return <p ref={ref} className={cx("sk-card-body", className)} {...rest} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("sk-card-footer", className)} {...rest} />;
  },
);
