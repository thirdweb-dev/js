import { NFTMetadata } from "@thirdweb-dev/sdk/internal/react";
import React from "react";
import type { SharedMediaProps } from "./types";
import { MediaRenderer } from "./MediaRenderer";

/**
 * The props for the {@link ThirdwebNftMedia} component.
 */
export interface ThirdwebNftMediaProps extends SharedMediaProps {
  /**
   * The NFT metadata of the NFT returned by the thirdweb sdk.
   */
  metadata: NFTMetadata;
  width?: string;
  height?: string;
}

/**
 * This component can be used to render NFTs from the thirdweb SDK.
 * It will render the animation_url if it exists, otherwise it will render the image.
 * The default size is 300px by 300px, but this can be changed using the `width` and `height` props.
 *
 * Props: {@link ThirdwebNftMediaProps}
 *
 * @example
 * ```jsx
 * import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
 * export default function NFTCollectionRender() {
 *   const { contract } = useContract(<your-contract-address>);
 *   const { data: nft, isLoading } = useNFT(contract, 0);
 *
 *   return (
 *     <div>
 *       {!isLoading && nft ? (
 *         <ThirdwebNftMedia metadata={nft.metadata} />
 *       ) : (
 *         <p>Loading...</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
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
