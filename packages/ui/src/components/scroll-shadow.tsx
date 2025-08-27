"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useLayoutEffect, useRef } from "react";

export function ScrollShadow(props: {
  children: React.ReactNode;
  className?: string;
  scrollableClassName?: string;
  disableTopShadow?: boolean;
  shadowColor?: string;
  shadowClassName?: string;
}) {
  const scrollableEl = useRef<HTMLDivElement>(null);
  const shadowTopEl = useRef<HTMLDivElement>(null);
  const shadowBottomEl = useRef<HTMLDivElement>(null);
  const shadowLeftEl = useRef<HTMLDivElement>(null);
  const shadowRightEl = useRef<HTMLDivElement>(null);
  const wrapperEl = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = scrollableEl.current;
    const shadowTop = shadowTopEl.current;
    const shadowBottom = shadowBottomEl.current;
    const wrapper = wrapperEl.current;
    const shadowLeft = shadowLeftEl.current;
    const shadowRight = shadowRightEl.current;

    if (!content || !shadowTop || !shadowBottom || !wrapper) {
      return;
    }

    function handleScroll() {
      if (
        !content ||
        !shadowTop ||
        !shadowBottom ||
        !shadowLeft ||
        !shadowRight ||
        !wrapper
      ) {
        return;
      }

      const contentScrollHeight = content.scrollHeight - wrapper.offsetHeight;
      const contentScrollWidth = content.scrollWidth - wrapper.offsetWidth;

      if (contentScrollHeight > 10) {
        const currentScroll = content.scrollTop / contentScrollHeight;
        shadowTop.style.opacity = `${currentScroll}`;
        shadowBottom.style.opacity = `${1 - currentScroll}`;
      } else {
        shadowTop.style.opacity = "0";
        shadowBottom.style.opacity = "0";
      }

      if (contentScrollWidth > 10) {
        const currentScrollX = content.scrollLeft / contentScrollWidth;
        shadowLeft.style.opacity = `${currentScrollX}`;
        shadowRight.style.opacity = `${1 - currentScrollX}`;
      } else {
        shadowLeft.style.opacity = "0";
        shadowRight.style.opacity = "0";
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        handleScroll();
      });
    });
    content.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    resizeObserver.observe(content);
    return () => {
      content.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(props.className, "relative overflow-hidden")}
      ref={wrapperEl}
      style={
        {
          "--shadow": props.shadowColor || "hsl(var(--muted))",
        } as React.CSSProperties
      }
    >
      <div
        className={props.shadowClassName}
        ref={shadowTopEl}
        style={{
          ...scrollShadowTop,
          ...scrollShadowY,
          display: props.disableTopShadow ? "none" : "block",
          opacity: "0",
        }}
      />
      <div
        className={props.shadowClassName}
        ref={shadowBottomEl}
        style={{
          ...scrollShadowBottom,
          ...scrollShadowY,
          opacity: "0",
        }}
      />
      <div
        className={props.shadowClassName}
        ref={shadowLeftEl}
        style={{
          ...scrollShadowLeft,
          ...scrollShadowX,
          opacity: "0",
        }}
      />
      <div
        className={props.shadowClassName}
        ref={shadowRightEl}
        style={{
          ...scrollShadowRight,
          ...scrollShadowX,
          opacity: "0",
        }}
      />
      <div
        className={cn("no-scrollbar overflow-auto", props.scrollableClassName)}
        data-scrollable
        ref={scrollableEl}
      >
        {props.children}
      </div>
    </div>
  );
}

const scrollShadowY: React.CSSProperties = {
  position: "absolute",
  left: 0,
  width: "100%",
  height: 32,
  pointerEvents: "none",
};

const scrollShadowX: React.CSSProperties = {
  position: "absolute",
  top: 0,
  width: 32,
  height: "100%",
  pointerEvents: "none",
};

const scrollShadowTop: React.CSSProperties = {
  top: 0,
  background: "linear-gradient(to bottom, var(--shadow), transparent)",
  opacity: 0,
};

const scrollShadowBottom: React.CSSProperties = {
  bottom: 0,
  background: "linear-gradient(to top, var(--shadow), transparent)",
};

const scrollShadowLeft: React.CSSProperties = {
  left: 0,
  background: "linear-gradient(to right, var(--shadow), transparent)",
};

const scrollShadowRight: React.CSSProperties = {
  right: 0,
  background: "linear-gradient(to left, var(--shadow), transparent)",
};
