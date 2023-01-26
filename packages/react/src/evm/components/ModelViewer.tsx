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
  ({ src, alt, style, poster, ...restProps }, ref) => {
    const modelRef = useRef<HTMLCanvasElement>(null);

    return (
      <div style={{...style}}>
        <model-viewer
          style={{ objectFit: 'contain', width:'100%' }}
          src={src}
          alt={alt}
          camera-controls
          ref={mergeRefs([modelRef, ref])}   
          poster={poster}     
          {...restProps}>
        </model-viewer>
      </div>
    );
  }
);

ModelViewer.displayName = "ModelViewer";

export default ModelViewer