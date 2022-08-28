import { resolveIpfsUri, resolveMimeType } from "../utils/ipfs";
import { shouldRenderAudioTag, shouldRenderVideoTag } from "../utils/media";
import { mergeRefs } from "../utils/react";
import {
  CarbonDocumentAudio,
  CarbonDocumentUnknown,
  CarbonPauseFilled,
  CarbonPlayFilledAlt,
} from "./Icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";

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
}

interface PlayButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

const PlayButton: React.VFC<PlayButtonProps> = ({ onClick, isPlaying }) => {
  const [isHovering, setIsHovering] = useState(false);
  const onMouseEnter = () => setIsHovering(true);
  const onMouseLeave = () => setIsHovering(false);
  const onMouseDown = () => setIsHovering(false);
  const onMouseUp = () => setIsHovering(true);
  return (
    <button
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        transform: "translate(-25%, -25%)",
        maxWidth: "32px",
        width: "8%",
        minWidth: "24px",
        aspectRatio: "1",
        zIndex: 3,
        backgroundColor: "#fff",
        color: "rgb(138, 147, 155)",
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        border: "1px solid rgb(229, 232, 235)",
        cursor: "pointer",
        ...(isHovering
          ? {
              color: "rgb(53, 56, 64)",
              boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
            }
          : {}),
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {!isPlaying ? (
        <CarbonPlayFilledAlt style={{ width: "66%", height: "66%" }} />
      ) : (
        <CarbonPauseFilled style={{ width: "66%", height: "66%" }} />
      )}
    </button>
  );
};

const VideoPlayer = React.forwardRef<
  HTMLVideoElement,
  React.PropsWithChildren<MediaRendererProps>
>(
  (
    {
      src,
      alt,
      poster,
      requireInteraction,
      children,
      style,
      width,
      height,
      controls,
      ...restProps
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(!requireInteraction);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
      if (videoRef.current) {
        if (playing) {
          try {
            videoRef.current.play();
          } catch (err) {
            console.error("error playing video", err);
          }
        } else {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (err) {
            console.error("error pausing video", err);
          }
        }
      }
    }, [playing]);

    return (
      <div style={{ position: "relative", ...style }} {...restProps}>
        <video
          ref={mergeRefs([videoRef, ref])}
          src={src ?? undefined}
          poster={poster ?? undefined}
          loop
          playsInline
          muted={muted}
          preload={poster ? "metadata" : "auto"}
          onCanPlay={() => {
            if (playing) {
              videoRef.current?.play();
            }
          }}
          width={width}
          height={height}
          controls={controls}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
            zIndex: 1,
            transition: "opacity .5s",
            opacity: !poster ? 1 : playing ? 1 : 0,
          }}
        />
        {poster && (
          <img
            src={poster}
            style={{
              objectFit: "contain",
              pointerEvents: "none",
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 2,
              transition: "opacity .5s",
              opacity: playing ? 0 : 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
        <PlayButton
          onClick={() => {
            setPlaying((prev) => !prev);
            setMuted(false);
          }}
          isPlaying={playing}
        />
      </div>
    );
  },
);

const AudioPlayer = React.forwardRef<
  HTMLAudioElement,
  React.PropsWithChildren<MediaRendererProps>
>(
  (
    {
      src,
      alt,
      poster,
      requireInteraction,
      children,
      style,
      height,
      width,
      controls,
      ...restProps
    },
    ref,
  ) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
      if (audioRef.current) {
        if (playing) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }, [playing]);

    return (
      <div style={{ position: "relative", ...style }} {...restProps}>
        {poster ? (
          <img
            height={height}
            width={width}
            src={poster}
            style={{
              height: "100%",
              width: "100%",
              pointerEvents: "none",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              backgroundColor: "#fff",
              color: "rgb(138, 147, 155)",
            }}
          >
            <CarbonDocumentAudio style={{ height: "64px", width: "64px" }} />
          </div>
        )}

        <PlayButton
          onClick={() => {
            setPlaying((prev) => !prev);
            setMuted(false);
          }}
          isPlaying={playing}
        />
        <audio
          ref={mergeRefs([audioRef, ref])}
          src={src ?? undefined}
          loop
          playsInline
          muted={muted}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
            visibility: "hidden",
          }}
        />
      </div>
    );
  },
);

const IframePlayer = React.forwardRef<
  HTMLIFrameElement,
  React.PropsWithChildren<MediaRendererProps>
>(
  (
    {
      src,
      alt,
      poster,
      requireInteraction,
      children,
      style,
      height,
      width,
      controls,
      ...restProps
    },
    ref,
  ) => {
    const { observe, width: elWidth } = useDimensions<HTMLDivElement | null>();
    const [playing, setPlaying] = useState(!requireInteraction);

    if (elWidth < 300) {
      return (
        <div ref={observe}>
          <LinkPlayer style={style} src={src} alt={alt} {...restProps} />
        </div>
      );
    }

    return (
      <div
        style={{ position: "relative", ...style }}
        {...restProps}
        ref={observe}
      >
        <iframe
          src={playing ? src ?? undefined : undefined}
          ref={ref}
          style={{
            objectFit: "contain",
            zIndex: 1,
            height: "100%",
            width: "100%",
            transition: "opacity .5s",
            opacity: !poster ? 1 : playing ? 1 : 0,
          }}
        />
        {poster && (
          <img
            src={poster}
            style={{
              objectFit: "contain",
              pointerEvents: "none",
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 2,
              transition: "opacity .5s",
              opacity: playing ? 0 : 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
        <PlayButton
          onClick={() => {
            setPlaying((prev) => !prev);
          }}
          isPlaying={playing}
        />
      </div>
    );
  },
);
const LinkPlayer = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<MediaRendererProps>
>(
  (
    {
      src,
      alt,
      poster,
      requireInteraction,
      children,
      style,
      height,
      width,
      controls,
      ...restProps
    },
    ref,
  ) => {
    return (
      <div style={{ position: "relative", ...style }} {...restProps}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            backgroundColor: "#fff",
            color: "rgb(138, 147, 155)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <CarbonDocumentUnknown
              style={{
                maxWidth: "128px",
                minWidth: "48px",
                width: "50%",
                aspectRatio: "1",
              }}
            />
            <a
              rel="noopener noreferrer"
              style={{
                textDecoration: "underline",
                color: "rgb(138, 147, 155)",
              }}
              href={src ?? undefined}
              target="_blank"
              ref={ref as unknown as React.LegacyRef<HTMLAnchorElement>}
            >
              {alt || "File"}
            </a>
          </div>
        </div>
      </div>
    );
  },
);

/**
 * This component can be used to render any media type, including image, audio, video, and html files.
 * Its convenient for rendering NFT media files, as these can be a variety of different types.
 * The component falls back to a external link if the media type is not supported.
 *
 * Props: {@link MediaRendererProps}
 *
 * @example
 * We can take a video file hosted on IPFS and render it using this component as follows
 * ```jsx
 * const Component = () => {
 *   return <MediaRenderer
 *     src="ipfs://Qmb9ZV5yznE4C4YvyJe8DVFv1LSVkebdekY6HjLVaKmHZi"
 *     alt="A mp4 video"
 *   />
 * }
 * ```
 *
 * You can try switching out the `src` prop to different types of URLs and media types to explore the possibilities.
 */
export const MediaRenderer = React.forwardRef<
  HTMLMediaElement,
  React.PropsWithChildren<MediaRendererProps>
>(
  (
    {
      children,
      src,
      poster,
      alt,
      requireInteraction = false,
      style,
      ...restProps
    },
    ref,
  ) => {
    const mergedStyle: React.CSSProperties = { objectFit: "contain", ...style };
    const videoOrImageSrc = useResolvedMediaType(src ?? undefined);
    const possiblePosterSrc = useResolvedMediaType(poster ?? undefined);
    if (!videoOrImageSrc.mimeType) {
      return (
        <img
          style={mergedStyle}
          {...restProps}
          ref={ref as unknown as React.LegacyRef<HTMLImageElement>}
        />
      );
    } else if (videoOrImageSrc.mimeType === "text/html") {
      return (
        <IframePlayer
          style={mergedStyle}
          src={videoOrImageSrc.url}
          poster={possiblePosterSrc.url}
          requireInteraction={requireInteraction}
          {...restProps}
        />
      );
    } else if (shouldRenderVideoTag(videoOrImageSrc.mimeType)) {
      return (
        <VideoPlayer
          style={mergedStyle}
          src={videoOrImageSrc.url}
          poster={possiblePosterSrc.url}
          requireInteraction={requireInteraction}
          {...restProps}
        />
      );
    } else if (shouldRenderAudioTag(videoOrImageSrc.mimeType)) {
      return (
        <AudioPlayer
          style={mergedStyle}
          src={videoOrImageSrc.url}
          poster={possiblePosterSrc.url}
          requireInteraction={requireInteraction}
          {...restProps}
        />
      );
    } else if (videoOrImageSrc.mimeType.startsWith("image/")) {
      return (
        <img
          style={mergedStyle}
          src={videoOrImageSrc.url}
          alt={alt}
          ref={ref as unknown as React.LegacyRef<HTMLImageElement>}
          {...restProps}
        />
      );
    }
    return (
      <LinkPlayer
        style={mergedStyle}
        src={videoOrImageSrc.url}
        alt={alt}
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        {...restProps}
      />
    );
  },
);

export interface MediaType {
  url?: string;
  mimeType?: string;
}

/**
 * @param uri - the uri to resolve (can be a url or a ipfs://\<cid\>)
 * @returns the fully resolved url + mime type of the media
 *
 * @example
 * Usage with fully formed url:
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("https://example.com/video.mp4");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * Usage with ipfs cid:
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvsd");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 */
export function useResolvedMediaType(uri?: string) {
  const resolvedUrl = useMemo(() => resolveIpfsUri(uri), [uri]);
  const resolvedMimType = useQuery(
    ["mime-type", resolvedUrl],
    () => resolveMimeType(resolvedUrl),
    {
      enabled: !!resolvedUrl,
    },
  );

  return {
    url: resolvedUrl,
    mimeType: resolvedMimType.data,
  };
}
