"use client";
import type React from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  CarbonDocumentAudio,
  CarbonDocumentUnknown,
  CarbonPauseFilled,
  CarbonPlayFilledAlt,
} from "./icons.js";
import type { MediaRendererProps } from "./types.js";
import { useResolvedMediaType } from "./useResolvedMediaType.js";

/**
 * Component that renders any asset stored on IPFS (or anywhere else), given the IPFS URI / URL.
 *
 * If an IPFS url is given, the asset is fetched from IPFS through the thirdweb IPFS gateway by default. You can also specify a custom gateway URL using the `gatewayUrl` prop.
 *
 * The [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the
 * asset is determined and the appropriate component is rendered on the UI.
 *
 * For example, if the URI points to an image, the `img` tag will be used. If it is a video, the `video` tag will be used, etc.
 * The component currently supports:
 *
 * - Images
 * - Videos
 * - Audio files
 * - SVGs (for [on-chain NFTs](https://blog.thirdweb.com/guides/how-to-create-on-chain-nfts-with-thirdweb/))
 * - `iframe` and `HTML`
 * - If none of these are appropriate, the fallback is a link to the asset
 *
 * The default size of rendered media is 300px x 300px, but this can be changed using the `width` and `height` props.
 *
 * You can use thirdweb CLI to upload any file to IPFS and get the IPFS URI
 *
 * Note: This component no longer supports 3D models as of v5.92.0!
 *
 * `npx thirdweb upload <path/to/file>`
 * @example
 * ```tsx
 * import { MediaRenderer } from "thirdweb/react";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 *
 * function Home() {
 * 	return (
 * 		<MediaRenderer client={client} src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X" />
 * 	);
 * }
 * ```
 * @param props - Refer to [`MediaRendererProps`](https://portal.thirdweb.com/references/typescript/v5/MediaRendererProps) to see the available props.
 */
export const MediaRenderer = /* @__PURE__ */ (() =>
  forwardRef<HTMLMediaElement, MediaRendererProps>(function Media_Renderer(
    {
      src,
      poster,
      alt,
      gatewayUrl,
      requireInteraction = false,
      width = "300px",
      height = "300px",
      style,
      mimeType,
      client,
      controls,
      className,
    },
    ref,
  ) {
    const mergedStyle: React.CSSProperties = {
      objectFit: "contain",
      ...style,
    };

    const { mediaInfo, isFetched: mediaInfoIsFetched } = useResolvedMediaType(
      client,
      src ?? undefined,
      mimeType,
      gatewayUrl,
    );

    const { mediaInfo: possiblePosterSrc } = useResolvedMediaType(
      client,
      poster ?? undefined,
      undefined,
      gatewayUrl,
    );

    if (!mediaInfoIsFetched || !src) {
      return <div className={className} style={style} />;
    }

    if (mediaInfo.mimeType) {
      // html content
      if (mediaInfo.mimeType.startsWith("text/html")) {
        return (
          <IframePlayer
            alt={alt}
            className={className}
            poster={possiblePosterSrc.url}
            ref={ref as unknown as React.ForwardedRef<HTMLIFrameElement>}
            requireInteraction={requireInteraction}
            src={mediaInfo.url}
            style={mergedStyle}
          />
        );
      }

      // 3d model
      if (mediaInfo.mimeType.startsWith("model")) {
        console.error(
          "Encountered an unsupported media type. 3D model support was removed in v5.92.0. To add a 3D model to your app, use @google/model-viewer and use the ModelViewer component.",
        );

        // show poster
        if (possiblePosterSrc.mimeType?.startsWith("image/")) {
          return (
            <ImageRenderer
              alt={alt}
              className={className}
              height={height}
              ref={ref as unknown as React.ForwardedRef<HTMLImageElement>}
              src={possiblePosterSrc.url}
              style={mergedStyle}
              width={width}
            />
          );
        }
      }

      //  video
      if (mediaInfo.mimeType.startsWith("video")) {
        return (
          <VideoPlayer
            className={className}
            controls={controls}
            poster={
              possiblePosterSrc.mimeType?.startsWith("image/")
                ? possiblePosterSrc.url
                : undefined
            }
            ref={ref as unknown as React.ForwardedRef<HTMLVideoElement>}
            requireInteraction={requireInteraction}
            src={mediaInfo.url}
            style={mergedStyle}
          />
        );
      }

      // audio
      if (mediaInfo.mimeType.startsWith("audio")) {
        return (
          <AudioPlayer
            alt={alt}
            className={className}
            controls={controls}
            height={height}
            poster={possiblePosterSrc.url}
            ref={ref as unknown as React.ForwardedRef<HTMLAudioElement>}
            src={mediaInfo.url}
            style={mergedStyle}
            width={width}
          />
        );
      }

      // image
      if (mediaInfo.mimeType.startsWith("image/")) {
        return (
          <ImageRenderer
            alt={alt}
            className={className}
            height={height}
            ref={ref as unknown as React.ForwardedRef<HTMLImageElement>}
            src={mediaInfo.url}
            style={mergedStyle}
            width={width}
          />
        );
      }
    }

    // unknown mime types or no mime type
    return (
      <LinkPlayer
        alt={alt}
        className={className}
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        src={mediaInfo.url}
        style={mergedStyle}
      />
    );
  }))();

interface PlayButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, isPlaying }) => {
  const [isHovering, setIsHovering] = useState(false);
  const onMouseEnter = () => setIsHovering(true);
  const onMouseLeave = () => setIsHovering(false);
  const onMouseDown = () => setIsHovering(false);
  const onMouseUp = () => setIsHovering(true);
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      style={{
        backgroundColor: "#fff",
        border: "1px solid rgb(229, 232, 235)",
        borderRadius: "50%",
        bottom: 0,
        color: "rgb(138, 147, 155)",
        cursor: "pointer",
        display: "grid",
        height: "32px",
        padding: 0,
        placeItems: "center",
        position: "absolute",
        right: 0,
        transform: "translate(-25%, -25%)",
        width: "32px",
        zIndex: 3,
        ...(isHovering
          ? {
              boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
              color: "rgb(53, 56, 64)",
            }
          : {}),
      }}
      type="button"
    >
      {!isPlaying ? <CarbonPlayFilledAlt /> : <CarbonPauseFilled />}
    </button>
  );
};

const ImageRenderer = /* @__PURE__ */ (() =>
  forwardRef<
    HTMLImageElement,
    Pick<
      MediaRendererProps,
      "src" | "style" | "alt" | "className" | "height" | "width"
    >
  >(function Image_Renderer(props, ref) {
    const { style, src, alt, className, height, width } = props;
    const [error, setError] = useState(false);

    if (error) {
      return (
        <LinkPlayer
          alt={alt}
          className={className}
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          src={src}
          style={style}
        />
      );
    }

    return (
      <img
        alt={alt}
        className={className}
        height={height}
        onError={() => {
          setError(true);
        }}
        ref={ref}
        src={src ?? undefined}
        style={style}
        width={width}
      />
    );
  }))();

const VideoPlayer = /* @__PURE__ */ (() =>
  forwardRef<
    HTMLVideoElement,
    Pick<
      MediaRendererProps,
      | "alt"
      | "src"
      | "poster"
      | "requireInteraction"
      | "style"
      | "width"
      | "height"
      | "controls"
      | "className"
    >
  >(function Video_Player(
    {
      src,
      alt,
      poster,
      requireInteraction,
      style,
      width,
      height,
      controls,
      className,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(!requireInteraction);
    const [muted, setMuted] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (videoRef.current) {
        if (playing) {
          try {
            videoRef.current.play();
          } catch (err) {
            console.error("Error playing video", err);
          }
        } else {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (err) {
            console.error("Error pausing video", err);
          }
        }
      }
    }, [playing]);

    if (error) {
      return (
        <LinkPlayer
          alt={alt}
          className={className}
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          src={src}
          style={style}
        />
      );
    }

    return (
      <div className={className} style={{ position: "relative", ...style }}>
        <video
          controls={controls}
          controlsList="nodownload"
          height={height}
          loop
          muted={muted}
          onCanPlay={() => {
            if (playing) {
              videoRef.current?.play();
            }
          }}
          onError={() => {
            setError(true);
          }}
          playsInline
          poster={poster ?? undefined}
          preload={poster ? "metadata" : "auto"}
          ref={mergeRefs([videoRef, ref])}
          src={src ?? undefined}
          style={{
            height: "100%",
            objectFit: "contain",
            opacity: !poster ? 1 : playing ? 1 : 0,
            transition: "opacity .5s",
            width: "100%",
            zIndex: 1,
          }}
          width={width}
        />
        {poster && (
          <img
            alt={alt}
            src={poster}
            style={{
              bottom: 0,
              height: "100%",
              left: 0,
              objectFit: "contain",
              opacity: playing ? 0 : 1,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
              transition: "opacity .5s",
              width: "100%",
              zIndex: 2,
            }}
          />
        )}
        <PlayButton
          isPlaying={playing}
          onClick={() => {
            setPlaying((prev) => !prev);
            setMuted(false);
          }}
        />
      </div>
    );
  }))();

const AudioPlayer = /* @__PURE__ */ (() =>
  forwardRef<
    HTMLAudioElement,
    Pick<
      MediaRendererProps,
      | "src"
      | "alt"
      | "poster"
      | "style"
      | "height"
      | "width"
      | "className"
      | "controls"
    >
  >(function Audio_Player(
    { src, alt, poster, style, height, width, className, controls },
    ref,
  ) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [error, setError] = useState(false);

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

    if (error) {
      return (
        <LinkPlayer
          alt={alt}
          className={className}
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          src={src}
          style={style}
        />
      );
    }

    return (
      <div className={className} style={{ position: "relative", ...style }}>
        {poster ? (
          <img
            alt={alt}
            height={height}
            src={poster}
            style={{
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              width: "100%",
            }}
            width={width}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              color: "rgb(138, 147, 155)",
              display: "grid",
              height: "100%",
              placeItems: "center",
              pointerEvents: "none",
              width: "100%",
            }}
          >
            <CarbonDocumentAudio style={{ height: "64px", width: "64px" }} />
          </div>
        )}

        <PlayButton
          isPlaying={playing}
          onClick={() => {
            setPlaying((prev) => !prev);
            setMuted(false);
          }}
        />
        <audio
          controls={controls}
          controlsList="nodownload"
          loop
          muted={muted}
          onError={() => {
            setError(true);
          }}
          playsInline
          preload="none"
          ref={mergeRefs([audioRef, ref])}
          src={src ?? undefined}
          style={{
            opacity: 0,
            pointerEvents: "none",
            position: "absolute",
            visibility: "hidden",
            zIndex: -1,
          }}
        />
      </div>
    );
  }))();

/**
 * @internal Exported for tests
 */
export const IframePlayer = /* @__PURE__ */ (() =>
  forwardRef<
    HTMLIFrameElement,
    Omit<
      MediaRendererProps,
      | "client"
      | "gatewayUrl"
      | "mimeType"
      | "controls"
      | "height"
      | "width"
      | "children"
    >
  >(function Iframe_Player(
    { src, alt, poster, requireInteraction, style, ...restProps },
    ref,
  ) {
    const [playing, setPlaying] = useState(!requireInteraction);

    return (
      <div style={{ position: "relative", ...style }} {...restProps}>
        <iframe
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ref={ref}
          sandbox="allow-scripts"
          src={playing ? (src ?? undefined) : undefined}
          style={{
            border: "none",
            height: "100%",
            objectFit: "contain",
            opacity: !poster ? 1 : playing ? 1 : 0,
            transition: "opacity .5s",
            width: "100%",
            zIndex: 1,
          }}
          title={alt || "thirdweb iframe player"}
        />
        {poster && (
          <img
            alt={alt}
            src={poster}
            style={{
              bottom: 0,
              height: "100%",
              left: 0,
              objectFit: "contain",
              opacity: playing ? 0 : 1,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
              transition: "opacity .5s",
              width: "100%",
              zIndex: 2,
            }}
          />
        )}
        <PlayButton
          isPlaying={playing}
          onClick={() => {
            setPlaying((prev) => !prev);
          }}
        />
      </div>
    );
  }))();

/**
 * @internal Exported for tests
 */
export const LinkPlayer = /* @__PURE__ */ (() =>
  forwardRef<
    HTMLAnchorElement,
    Pick<MediaRendererProps, "src" | "alt" | "style" | "className">
  >(function Link_Player({ src, alt, style, className }, ref) {
    return (
      <div className={className} style={{ position: "relative", ...style }}>
        <div
          style={{
            backgroundColor: "#fff",
            color: "rgb(138, 147, 155)",
            display: "grid",
            height: "100%",
            placeItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              gap: "8px",
            }}
          >
            <CarbonDocumentUnknown
              style={{
                aspectRatio: "1",
                maxWidth: "128px",
                minWidth: "48px",
                width: "50%",
              }}
            />
            <a
              href={src ?? undefined}
              ref={ref as unknown as React.LegacyRef<HTMLAnchorElement>}
              rel="noopener noreferrer"
              style={{
                color: "rgb(138, 147, 155)",
                textDecoration: "underline",
              }}
              target="_blank"
            >
              {alt || "File"}
            </a>
          </div>
        </div>
      </div>
    );
  }))();

/**
 * @internal
 */
// biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
