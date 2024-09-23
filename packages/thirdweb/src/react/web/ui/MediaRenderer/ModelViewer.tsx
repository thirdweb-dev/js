import "@google/model-viewer";
import type { ModelViewerElement } from "@google/model-viewer";
import React from "react";
import type { MediaRendererProps } from "./types.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": Partial<ModelViewerElement>;
    }
  }
}

const ModelViewer = /* @__PURE__ */ (() =>
  React.forwardRef<
    HTMLDivElement,
    Pick<MediaRendererProps, "src" | "alt" | "poster" | "style" | "className">
  >(function Model_Viewer({ src, alt, poster, style, className }, ref) {
    return (
      <div style={{ ...style }} className={className} ref={ref}>
        {src ? (
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
