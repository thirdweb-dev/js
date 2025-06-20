/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string; // Making alt required for accessibility
}

export const Image = ({ alt, ...props }: ImageProps) => {
  return (
    <img
      alt={alt}
      loading="lazy" // Add lazy loading by default
      {...props}
    />
  );
};
