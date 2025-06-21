"use client";

import { useEffect, useRef, useState } from "react";

export function StickyTopContainer(props: { children: React.ReactNode }) {
  const { height, elementRef } = useHeightObserver();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sticky-top-height",
      `${height}px`,
    );
  }, [height]);

  return (
    <div
      className="sticky top-0 z-stickyTop"
      style={{
        height: height ? `${height}px` : "auto",
      }}
    >
      <div ref={elementRef}>{props.children}</div>
    </div>
  );
}

function useHeightObserver() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.scrollHeight);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { elementRef: elementRef, height };
}
