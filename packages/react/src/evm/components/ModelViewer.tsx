/* eslint-disable @typescript-eslint/no-namespace */
import "@google/model-viewer";
import type { ModelViewerElement } from "@google/model-viewer";
import React from "react";
import type { MediaRendererProps } from "./types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": Partial<ModelViewerElement>;
    }
  }
}

export const ModelViewer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLDivElement, MediaRendererProps>(function Model_Viewer(
    { src, alt, poster, style },
    ref,
  ) {
    return (
      <div style={{ ...style }} ref={ref}>
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
