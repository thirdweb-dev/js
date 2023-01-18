import React, { useRef } from 'react';
import { MediaRendererProps } from './MediaRenderer';
import { mergeRefs } from "../utils/react";
import '@google/model-viewer'

declare global {
    namespace JSX {
        interface IntrinsicElements {
        'model-viewer': any;
        }
    }
}

export const ModelViewer = React.forwardRef<HTMLCanvasElement, MediaRendererProps>(
  ({ src, alt, style, ...restProps }, ref) => {
    const modelRef = useRef<HTMLCanvasElement>(null);

    return (
      <model-viewer
        style={style}
        src={src}
        alt={alt}
        camera-controls
        ref={mergeRefs([modelRef, ref])}        
        {...restProps}>
      </model-viewer>
    );
  }
);

ModelViewer.displayName = "ModelViewer";

export default ModelViewer