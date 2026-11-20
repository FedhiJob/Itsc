import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  /**
   * Layout variant:
   * - "fullscreen": Fixed full-viewport overlay for top-level route transitions.
   * - "page": Centered inside standard page flow (min-h-[50vh]).
   * - "card": Centered inside a card or section container (py-12).
   * - "inline": Compact loader for drawers, search modals, and subviews.
   */
  variant?: "fullscreen" | "page" | "card" | "inline";
  /**
   * Optional status message or label to display below the loader.
   */
  text?: string;
  /**
   * Additional custom classes for the container.
   */
  className?: string;
  /**
   * Custom width & height for the brand loading mark (in px).
   */
  imageSize?: number;
}

export function Loading({
  variant = "page",
  text = "Loading...",
  className,
  imageSize,
}: LoadingProps) {
  const defaultSize =
    imageSize ?? (variant === "inline" ? 48 : variant === "card" ? 64 : 88);

  const containerClasses = {
    fullscreen:
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center select-none",
    page: "flex min-h-[55vh] w-full flex-col items-center justify-center p-8 text-center select-none",
    card: "flex min-h-[260px] w-full flex-col items-center justify-center p-6 text-center select-none",
    inline:
      "flex w-full flex-col items-center justify-center py-6 text-center select-none",
  }[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(containerClasses, className)}
    >
      <div className="relative flex items-center justify-center">
        {/* Soft glowing ambient gold aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-full bg-brand-gold/25 blur-xl animate-pulse"
        />

        {/* Brand loading mark */}
        <div className="relative z-10 transition-transform duration-300">
          <Image
            src="/itsc_loading.png"
            alt="ITSC Loading"
            width={defaultSize}
            height={defaultSize}
            priority={variant === "fullscreen"}
            className="h-auto w-auto max-w-[120px] object-contain drop-shadow-sm select-none"
          />
        </div>
      </div>

      {/* Indeterminate brand loading beam */}
      <div
        aria-hidden="true"
        className={cn(
          "relative mt-5 h-1 overflow-hidden rounded-full bg-gray-200/80",
          variant === "inline" ? "w-24" : "w-36"
        )}
      >
        <div className="itsc-indeterminate absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold" />
      </div>

      {/* Optional helper text */}
      {text ? (
        <p className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/70 animate-pulse">
          {text}
        </p>
      ) : null}

      <span className="sr-only">{text || "Loading content..."}</span>
    </div>
  );
}
