import type { MediaRendererProps } from "./MediaRenderer";
import "@google/model-viewer";
import type { ModelViewerElement } from "@google/model-viewer";
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": Partial<ModelViewerElement>;
    }
  }
}

export const ModelViewer = React.forwardRef<HTMLDivElement, MediaRendererProps>(
  ({ src, alt, style, poster, ...restProps }, ref) => {
    return (
        <div style={{objectFit: 'contain', width: '100%'}} ref={ref}>
        {src ? (
          <model-viewer
            src={src}
            alt={alt || "3D Model"}
            camera-controls
            poster={poster ? poster : null}
            style={{width: '100%'} as CSSStyleDeclaration}
          />
        ) : null}
      </div>
    );
  },
);

ModelViewer.displayName = "ModelViewer";

export default ModelViewer;
