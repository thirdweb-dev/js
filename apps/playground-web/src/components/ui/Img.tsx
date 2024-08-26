"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type imgElementProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export function Img(props: imgElementProps) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative">
      {/* biome-ignore lint/a11y/useAltText: <explanation> */}
      <img
        {...props}
        onLoad={() => {
          setIsLoading(false);
        }}
        style={{
          opacity: isLoading ? 0 : 1,
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent animate-pulse rounded-lg" />
      )}
    </div>
  );
}
