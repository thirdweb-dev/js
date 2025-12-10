"use client";

import NumberFlow, { type Format } from "@number-flow/react";
import { useLayoutEffect, useRef, useState } from "react";

export function AnimatedNumbers(props: {
  value: number;
  format?: Format;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(props.value);

  useLayoutEffect(() => {
    if (ref.current) {
      // when the div becomes visible, set the value to the props value
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setValue(props.value);
          } else {
            setValue(0);
          }
        });
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [props.value]);

  return (
    <div ref={ref}>
      <NumberFlow
        willChange
        value={value}
        format={props.format}
        suffix={props.suffix}
      />
    </div>
  );
}
