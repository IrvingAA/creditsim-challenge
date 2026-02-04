import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { AutoFitTextProps } from "./types";

const DEFAULT_MAX_FONT_PX = 34;
const DEFAULT_MIN_FONT_PX = 16;
const DEFAULT_PRECISION_PX = 0.5;

export const AutoFitText: React.FC<AutoFitTextProps> = ({
  text,
  className,
  maxFontPx = DEFAULT_MAX_FONT_PX,
  minFontPx = DEFAULT_MIN_FONT_PX,
  precisionPx = DEFAULT_PRECISION_PX,
  allowWrapOnMin = true,
}) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [fontSizePx, setFontSizePx] = useState<number>(maxFontPx);
  const [wrapped, setWrapped] = useState<boolean>(false);

  const normalizedBounds = useMemo(() => {
    const min = Math.max(1, Math.min(minFontPx, maxFontPx));
    const max = Math.max(min, maxFontPx);
    return { min, max };
  }, [minFontPx, maxFontPx]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const span = textRef.current;
    if (!container || !span) return;

    let rafId: number | null = null;

    const fitsAt = (sizePx: number) => {
      span.style.fontSize = `${sizePx}px`;
      span.style.whiteSpace = "nowrap";
      
      void span.offsetWidth;
      return span.scrollWidth <= container.clientWidth;
    };

    const fit = () => {
      if (container.clientWidth <= 0) return;

      const { min, max } = normalizedBounds;
      const originalFontSize = span.style.fontSize;
      const originalWhiteSpace = span.style.whiteSpace;

      let low = min;
      let high = max;
      let best = min;

      while (high - low > precisionPx) {
        const mid = (low + high) / 2;
        if (fitsAt(mid)) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      
      const fitsAtMin = fitsAt(min);
      const shouldWrap = allowWrapOnMin && !fitsAtMin;
      setWrapped(shouldWrap);
      setFontSizePx(shouldWrap ? min : best);

      span.style.fontSize = originalFontSize;
      span.style.whiteSpace = originalWhiteSpace;
    };

    const scheduleFit = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => fit());
    };

    scheduleFit();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleFit);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", scheduleFit);
    }

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", scheduleFit);
    };
  }, [text, normalizedBounds, precisionPx, allowWrapOnMin]);

  return (
    <p ref={containerRef} className={cn("w-full min-w-0 text-center", className)}>
      <span
        ref={textRef}
        className={cn(
          "inline-block max-w-full tabular-nums tracking-tight leading-tight",
          wrapped ? "whitespace-normal break-all" : "whitespace-nowrap"
        )}
        style={{ fontSize: `${fontSizePx}px` }}
        title={text}
      >
        {text}
      </span>
    </p>
  );
};
