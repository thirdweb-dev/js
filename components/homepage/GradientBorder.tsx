/* eslint-disable react/forbid-dom-props */
import React from "react";

interface GradientBorderProps {
  gradient: string;
  width: string;
  borderRadius: string;
}

/**
 * Renders a gradient border without a background color
 * Put this component inside a container with position relative
 */

export const GradientBorder: React.FC<GradientBorderProps> = ({
  borderRadius,
  gradient,
  width,
}) => {
  return (
    <div
      style={
        {
          pointerEvents: "none",
          padding: width,
          background: gradient,
          position: "absolute",
          inset: 0,
          borderRadius,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
        } as React.CSSProperties
      }
    ></div>
  );
};
