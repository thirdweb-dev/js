import { NFTMetadata } from "@thirdweb-dev/sdk";
import React from "react";
import type { SharedMediaProps } from "./types";
import { MediaRenderer } from "./MediaRenderer";

export interface ThirdwebNftMediaProps extends SharedMediaProps {
  /**
   * The NFT metadata of the NFT returned by the thirdweb sdk.
   */
  metadata: NFTMetadata;
  /**
   * CSS width of the media
   */
  width?: string;
  /**
   * CSS height of the media
   */
  height?: string;
}

/**
 * Component that renders an NFT from given a `metadata` object.
 *
 * Under the hood, if the `image` property of the metadata is an URL/IPFS URI, it is fetched from the source.
 * The [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the
 * asset is determined and the appropriate component is rendered on the UI.
 *
 * For example, if your NFT is an image, the `img` tag will be used. If it is a video, the `video` tag will be used, etc.
 *
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
 * Provide the `metadata` object to the component to render the NFT.
 *
 * The NFT's `image` is used as the media, and the `name` is used as the alt text for the media.
 *
 * ```jsx
 * import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// Connect to your NFT contract
 * 	const { contract } = useContract("{{contract_address}}");
 * 	// Load the NFT metadata from the contract using a hook
 * 	const { data: nft, isLoading, error } = useNFT(contract, "0");
 *
 * 	// Render the NFT onto the UI
 * 	if (isLoading) return <div>Loading...</div>;
 * 	if (error || !nft) return <div>NFT not found</div>;
 *
 * 	return <ThirdwebNftMedia metadata={nft.metadata} />;
 * }
 * ```
 *
 * @param props -
 * The props for the component.
 *
 * ### controls (optional)
 * Show the media controls (play, pause, etc.) for the media, where applicable.
 *
 * The default value is `false`.
 *
 *
 * ### height (optional)
 * The height of the rendered media.
 *
 * The default value is `auto`.
 *
 *
 * ### width (optional)
 * The width of the rendered media.
 *
 * The default value is `auto`.
 *
 * ### requireInteraction (optional)
 * Require user interaction to play the media (i.e. disable autoplay).
 *
 * The default value is `false`.
 *
 *
 * ### className (optional)
 * Apply custom CSS styles to the button using a class name
 *
 *
 * ### style (optional)
 * Apply custom CSS styles to the button using an inline style.
 */
export const ThirdwebNftMedia = /* @__PURE__ */ (() =>
  React.forwardRef<HTMLMediaElement, ThirdwebNftMediaProps>(
    function Thirdweb_NftMedia(
      { metadata, width = "300px", height = "300px", style, ...props },
      ref,
    ) {
      return (
        <MediaRenderer
          src={metadata.animation_url || metadata.image}
          poster={metadata.image}
          alt={metadata.name?.toString() || ""}
          ref={ref}
          width={width}
          height={height}
          style={{ ...style }}
          {...props}
        />
      );
    },
  ))();
