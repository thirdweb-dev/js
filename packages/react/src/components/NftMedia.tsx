import { MediaRenderer, SharedMediaProps } from "./MediaRenderer";
import { NFTMetadata } from "@thirdweb-dev/sdk";
import React from "react";

/**
 * The props for the {@link ThirdwebNftMedia} component.
 */
export interface ThirdwebNftMediaProps extends SharedMediaProps {
  /**
   * The NFT metadata of the NFT returned by the thirdweb sdk.
   */
  metadata: NFTMetadata;
}

/**
 *
 * @example
 * ```jsx
 * import { ThirdwebNftMedia, useNFTCollection, useNFT } from "@thirdweb-dev/react";
 * export default function NFTCollectionRender() {
 *   const contract = useNFTCollection(<your-contract-address>);
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
 *
 * Use this to get the primary sales recipient of your {@link SmartContract}
 * @param contract - an instance of a {@link SmartContract}
 * @returns the wallet address of the primary sales recipient
 * @beta
 */
export const ThirdwebNftMedia = React.forwardRef<
  HTMLMediaElement,
  ThirdwebNftMediaProps
>(({ metadata, ...props }, ref) => {
  return (
    <MediaRenderer
      src={metadata.animation_url || metadata.image}
      poster={metadata.image}
      alt={metadata.name?.toString() || ""}
      ref={ref}
      {...props}
    />
  );
});
