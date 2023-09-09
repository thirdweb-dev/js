import React, { useState, useRef, useEffect } from "react";

export function DynamicHeight(props: {
  children: React.ReactNode;
  maxHeight?: string;
}) {
  const contentRef = useRef(null);
  const height = useHeightObserver(contentRef);

  return (
    <div
      style={{
        height: height ? `${height}px` : "auto",
        transition: "height 210ms cubic-bezier(0.175, 0.885, 0.32, 1.1)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        ref={contentRef}
        style={{
          maxHeight: props.maxHeight,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export function useHeightObserver(contentRef: React.RefObject<HTMLElement>) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState<number | undefined>();
  const observer = useRef<ResizeObserver | null>(null);

  //Clean up observer
  const cleanOb = () => {
    if (observer.current) {
      observer.current.disconnect();
    }
  };

  useEffect(() => {
    setElement(contentRef.current);
  }, [contentRef]);

  useEffect(() => {
    if (!element) {
      return;
    }
    // Element has changed, disconnect old observer
    cleanOb();

    const ob = (observer.current = new ResizeObserver(([entry]) => {
      setHeight(entry.target.scrollHeight);
    }));
    ob.observe(element);

    // disconnect when component is unmounted
    return () => {
      cleanOb();
    };
  }, [element]);

  return height;
}
