import { shouldRenderAudioTag, shouldRenderVideoTag } from "../utils/media";
import { mergeRefs } from "../utils/react";
import {
  CarbonDocumentAudio,
  CarbonDocumentUnknown,
  CarbonPauseFilled,
  CarbonPlayFilledAlt,
} from "./Icons";
import { useQuery } from "@tanstack/react-query";
import { resolveMimeType, useStorage } from "@thirdweb-dev/react-core";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import type { MediaRendererProps } from "./types";

const ModelViewer = /* @__PURE__ */ lazy(() => import("./ModelViewer"));

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

const VideoPlayer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLVideoElement, MediaRendererProps>(function Video_Player(
    {
      src,
      alt,
      poster,
      requireInteraction,
      style,
      width,
      height,
      controls,
      ...restProps
    },
    ref,
  ) {
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
          controlsList="nodownload"
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
            alt={alt}
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
  }))();

const AudioPlayer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLAudioElement, MediaRendererProps>(function Audio_Player(
    { src, alt, poster, style, height, width, ...restProps },
    ref,
  ) {
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
            alt={alt}
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
          preload="none"
          controlsList="nodownload"
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
  }))();

const IframePlayer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLIFrameElement, MediaRendererProps>(
    function Iframe_Player(
      { src, alt, poster, requireInteraction, style, ...restProps },
      ref,
    ) {
      const [playing, setPlaying] = useState(!requireInteraction);

      return (
        <div style={{ position: "relative", ...style }} {...restProps}>
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
            sandbox="allow-scripts"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
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
              alt={alt}
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
  ))();

const LinkPlayer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLAnchorElement, MediaRendererProps>(function Link_Player(
    { src, alt, style, ...restProps },
    ref,
  ) {
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
  }))();

/**
 * Component that renders any asset stored on IPFS (or anywhere else), given the IPFS URI / URL.
 *
 * Under the hood, the asset is fetched from IPFS through the thirdweb IPFS gateway (or just
 * a regular fetch if the `src` is not an IPFS URI).
 * The [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the
 * asset is determined and the appropriate component is rendered on the UI.
 *
 * For example, if the URI points to an image, the `img` tag will be used. If it is a video, the `video` tag will be used, etc.
 * The component currently supports:
 *
 * - Images
 * - Videos
 * - Audio files
 * - 3D Models
 * - SVGs (for [on-chain NFTs](https://blog.thirdweb.com/guides/how-to-create-on-chain-nfts-with-thirdweb/))
 * - `iframes` and `HTML`
 * - If none of these are appropriate, the fallback is a link to the asset
 *
 * @example
 *
 * Provide the IPFS URI (or any URL that points to media) to the `src` prop to render the asset.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X" />
 * 	);
 * }
 * ```
 *
 * @remarks
 * The default size of rendered media is 300px x 300px, but this can be changed using the `width` and `height` props.
 *
 * You can use `npx thirdweb upload <path/to/file>` to upload any file to IPFS and get the IPFS URI.
 *
 * @param props -
 * The props for the component
 *
 * ### src (required)
 *
 * The [src](https://www.w3schools.com/tags/att_img_src.asp) attribute specifies the URL of the media.
 *
 * This can be an IPFS URI, or any URL that points to media (e.g. HTTP URL, etc.).
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		<MediaRenderer
 * 			// highlight-next-line
 * 			src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### alt (recommended)
 *
 * The [alt](https://www.w3schools.com/tags/att_img_alt.asp) attributes provides alternative
 * information for the media, if a user for some reason cannot view it
 * (due to slow connection, an error in the `src` attribute, or if the user is visually impaired).
 *
 * The default value is `""`.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer
 * 			src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 			// highlight-next-line
 * 			alt="A red circle"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### poster (optional)
 *
 * The [poster](https://www.w3schools.com/tags/att_video_poster.asp) is the image
 * that is shown before the video is played.
 *
 * The default value is the first frame of the video.
 *
 * If the `src` is not a video, this prop is ignored.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer
 * 			src="ipfs://Qmb9ZV5yznE4C4YvyJe8DVFv1LSVkebdekY6HjLVaKmHZi"
 * 			// highlight-next-line
 * 			poster="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### controls (optional)
 *
 * Show the media controls (play, pause, etc.) for the media, where applicable.
 *
 * The default value is `false`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			controls={true}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### height (optional)
 *
 * The height of the rendered media.
 *
 * The default value is `auto`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			height={500}
 * 		/>
 * 	);
 * }
 * ```
 *
 * ### width (optional)
 *
 * The width of the rendered media.
 *
 * The default value is `auto`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			width={500}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### requireInteraction (optional)
 *
 * Require user interaction to play the media (i.e. disable autoplay).
 *
 * The default value is `false`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			requireInteraction={true}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### className (optional)
 *
 * Apply custom CSS styles to the button using a class name.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			className="my-custom-class"
 * 		/>
 * 	);
 * }
 * ```
 *
 * ### style (optional)
 *
 * Apply custom CSS styles to the button using an inline style.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			style={{ backgroundColor: "red" }}
 * 		/>
 * 	);
 * }
 * ```
 */
export const MediaRenderer = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLMediaElement, MediaRendererProps>(
    function Media_Renderer(
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
        ...restProps
      },
      ref,
    ) {
      const mergedStyle: React.CSSProperties = {
        objectFit: "contain",
        width,
        height,
        ...style,
      };
      const videoOrImageSrc = useResolvedMediaType(
        src ?? undefined,
        mimeType,
        gatewayUrl,
      );
      const possiblePosterSrc = useResolvedMediaType(
        poster ?? undefined,
        undefined,
        gatewayUrl,
      );

      if (!videoOrImageSrc.mimeType) {
        return (
          <img
            style={mergedStyle}
            {...restProps}
            ref={ref as unknown as React.LegacyRef<HTMLImageElement>}
            alt={alt}
          />
        );
      } else if (videoOrImageSrc.mimeType.startsWith("text/html")) {
        return (
          <IframePlayer
            style={mergedStyle}
            src={videoOrImageSrc.url}
            poster={possiblePosterSrc.url}
            requireInteraction={requireInteraction}
            {...restProps}
          />
        );
      } else if (videoOrImageSrc.mimeType.startsWith("model")) {
        return (
          <Suspense
            fallback={
              poster ? (
                <img
                  style={mergedStyle}
                  src={poster}
                  alt={alt}
                  ref={ref as unknown as React.LegacyRef<HTMLImageElement>}
                  {...restProps}
                />
              ) : null
            }
          >
            <ModelViewer
              style={mergedStyle}
              src={videoOrImageSrc.url || ""}
              poster={poster}
              alt={alt}
              {...restProps}
            />
          </Suspense>
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
  ))();

export interface MediaType {
  url?: string;
  mimeType?: string;
}

/**
 * Hook for resolving the media type and URL of a given URI (including IPFS URIs).
 *
 * The `<MediaRenderer />` component renders the relevant.
 * HTML element for a given URL, including IPFS URIs. e.g. `<img>` for images, `<video>` for videos, etc.
 *
 * @example
 * ### Usage with fully formed url
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("https://example.com/video.mp4");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * ### Usage with IPFS cid
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvsd");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * @param uri - The uri to resolve (can be a url or a `ipfs://\<cid\>`)
 * @param mimeType - The mime type of the media
 * @param gatewayUrl - The url of the IPFS gateway to use (defaults to `https://ipfs.io/ipfs/`)
 *
 * @returns
 * The hook returns an object containing two properties:
 * - `url`: The fully resolved URL, or `undefined` if the URI is invalid.
 * - `mimeType`: The mime type of the media, or `undefined` if the URI is invalid.
 *
 * @metadata
 */
export function useResolvedMediaType(
  uri?: string,
  mimeType?: string,
  gatewayUrl?: string,
) {
  const storage = useStorage();

  const resolvedUrl = useMemo(() => {
    if (!uri) {
      return "";
    }
    if (gatewayUrl) {
      return uri.replace("ipfs://", gatewayUrl);
    }
    if (storage) {
      return storage.resolveScheme(uri);
    }
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }, [uri, storage, gatewayUrl]);

  const resolvedMimType = useQuery(
    ["mime-type", resolvedUrl],
    () => resolveMimeType(resolvedUrl),
    {
      enabled: !!resolvedUrl && !mimeType,
      initialData: mimeType,
    },
  );

  return {
    url: resolvedUrl,
    mimeType: resolvedMimType.data,
  };
}
