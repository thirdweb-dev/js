"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import styles from "./ScrollShadow.module.css";

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

  useEffect(() => {
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
        className={cn(
          styles.scrollShadowTop,
          styles.scrollShadowY,
          props.shadowClassName,
        )}
        ref={shadowTopEl}
        style={{
          opacity: "0",
          display: props.disableTopShadow ? "none" : "block",
        }}
      />
      <div
        className={cn(
          styles.scrollShadowBottom,
          styles.scrollShadowY,
          props.shadowClassName,
        )}
        ref={shadowBottomEl}
        style={{
          opacity: "0",
        }}
      />
      <div
        className={cn(
          styles.scrollShadowLeft,
          styles.scrollShadowX,
          props.shadowClassName,
        )}
        ref={shadowLeftEl}
        style={{
          opacity: "0",
        }}
      />
      <div
        className={cn(
          styles.scrollShadowRight,
          styles.scrollShadowX,
          props.shadowClassName,
        )}
        ref={shadowRightEl}
        style={{
          opacity: "0",
        }}
      />
      <div
        className={cn(
          "hide-scrollbar overflow-auto",
          props.scrollableClassName,
        )}
        ref={scrollableEl}
        data-scrollable
      >
        {props.children}
      </div>
    </div>
  );
}
