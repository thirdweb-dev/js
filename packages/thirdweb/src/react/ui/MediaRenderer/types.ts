import type { ReactNode } from "react";

/**
 * Props taken by the for the [`MediaRenderer`](https://portal.thirdweb.com/references/typescript/v5/MediaRenderer) component
 */
export type MediaRendererProps = {
  /**
   * the `src` attribute specifies the URL of the media.
   *
   * This can be an IPFS URI or HTTP URL that points to media
   */
  src?: string | null;
  /**
   * The [alt](https://www.w3schools.com/tags/att_img_alt.asp) attributes provides alternative
   * information for the media, if a user for some reason cannot view it due to slow connection, an error in the `src` attribute, or if the user is visually impaired.
   *
   * The default value is `""`.
   */
  alt?: string;
  /**
   * The [poster](https://www.w3schools.com/tags/att_video_poster.asp) is the image
   * that is shown before the video is played.
   *
   * The default value is the first frame of the video.
   *
   * If the `src` is not a video, this prop is ignored.
   *
   */
  poster?: string | null;

  /**
   * Show the media controls (where applicable)
   *
   * By default it is set to `false`
   */
  controls?: HTMLVideoElement["controls"];

  /**
   * The IPFS gateway URL to use
   */
  gatewayUrl?: string;

  /**
   * The width of the rendered media.
   *
   * The default value is `auto`.
   */
  width?: string;
  /**
   * The height of the rendered media.
   *
   * The default value is `auto`.
   */
  height?: string;

  /**
   * The className to apply on the rendered element to add custom styling.
   */
  className?: string;

  /**
   * The style to apply on the rendered element to add custom styling.
   */
  style?: React.CSSProperties;

  /**
   * Require user interaction to play the media (i.e. disable autoplay).
   *
   * The default value is `false`.
   */
  requireInteraction?: boolean;

  children?: ReactNode;

  /**
   * Provide the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the media if it is known
   */
  mimeType?: string;
};
