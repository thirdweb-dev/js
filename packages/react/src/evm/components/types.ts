import type { ReactNode } from "react";

export interface SharedMediaProps {
  className?: string;
  style?: React.CSSProperties;
  width?: HTMLIFrameElement["width"];
  height?: HTMLIFrameElement["height"];
  /**
   * Require user interaction to play the media. (default false)
   */
  requireInteraction?: boolean;
  /**
   * Show the media controls (where applicable) (default false)
   */
  controls?: HTMLVideoElement["controls"];

  children?: ReactNode;

  mimeType?: string;
}

/**
 *
 * The props for the {@link MediaRenderer} component.
 * @public
 */
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
  width?: string;
  height?: string;
}
