import "@google/model-viewer";
import React from "react";
import type { MediaRendererProps } from "./types.js";

const ModelViewer = /* @__PURE__ */ (() =>
  React.forwardRef<
    HTMLDivElement,
    Pick<MediaRendererProps, "src" | "alt" | "poster" | "style" | "className">
  >(function Model_Viewer({ src, alt, poster, style, className }, ref) {
    return (
      <div style={{ ...style }} className={className} ref={ref}>
        {src ? (
          // @ts-expect-error - model-viewer is not a standard HTML element
          <model-viewer
            src={src}
            alt={alt || "3D Model"}
            camera-controls
            poster={poster ? poster : null}
            style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
          />
        ) : null}
      </div>
    );
  }))();

export default ModelViewer;
