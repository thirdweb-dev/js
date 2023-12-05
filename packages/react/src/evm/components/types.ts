import type { ReactNode } from "react";

export interface SharedMediaProps {
  /**
   * The className to apply on the rendered element to add custom styling.
   */
  className?: string;
  /**
   * The style to apply on the rendered element to add custom styling.
   */
  style?: React.CSSProperties;
  /**
   * The CSS width property to apply on the rendered element.
   */
  width?: HTMLIFrameElement["width"];
  /**
   * The CSS height property to apply on the rendered element.
   */
  height?: HTMLIFrameElement["height"];
  /**
   * Require user interaction to play the media.
   * @defaultValue false
   */
  requireInteraction?: boolean;
  /**
   * Show the media controls (where applicable)
   * @defaultValue false
   */
  controls?: HTMLVideoElement["controls"];

  children?: ReactNode;

  /**
   * Provide the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the media if it is known
   */
  mimeType?: string;
}

export interface MediaRendererProps extends SharedMediaProps {
  /**
   * The media source uri.
   */
  src?: string | null;
  /**
   * The alt text for the media.
   */
  alt?: string;
  /**
   * The media poster image uri. (if applicable)
   */
  poster?: string | null;
  /**
   * The IPFS gateway URL to use
   */
  gatewayUrl?: string;
  /**
   * The CSS width property to apply on the rendered element.
   */
  width?: string;
  /**
   * The CSS height property to apply on the rendered element.
   */
  height?: string;
}
