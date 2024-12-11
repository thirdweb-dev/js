"use client";

import { createContext, useContext } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";

/**
 * Props for the <NFT> component
 * @component
 */
export type NFTProviderProps = {
  /**
   * The NFT contract address. Accepts both ERC721 and ERC1155 contracts
   */
  contract: ThirdwebContract;
  /**
   * The tokenId whose info you want to display
   */
  tokenId: bigint;
};

/**
 * @internal
 */
export const NFTProviderContext = /* @__PURE__ */ createContext<
  NFTProviderProps | undefined
>(undefined);

/**
 * @internal
 */
export function useNFTContext() {
  const ctx = useContext(NFTProviderContext);
  if (!ctx) {
    throw new Error(
      "NFTProviderContext not found. Make sure you are using NFTMedia, NFTDescription, etc. inside a <NFTProvider /> component",
    );
  }
  return ctx;
}

/**
 * A React context provider component that supplies NFT-related data to its child components.
 *
 * This component serves as a wrapper around the `NFTProviderContext.Provider` and passes
 * the provided NFT data down to all of its child components through the context API.
 *
 *
 * @param {React.PropsWithChildren<NFTProviderProps>} props - The props for the NFT provider
 *
 * @example
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFTProvider, NFTMedia, NFTDescription, NFTName } from "thirdweb/react";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFTProvider contract={contract} tokenId={0n}>
 *    <NFTMedia />
 *    <NFTDescription />
 *    <NFTName />
 * </NFTProvider>
 * ```
 * @component
 * @nft
 * @beta
 */
export function NFTProvider(props: React.PropsWithChildren<NFTProviderProps>) {
  return (
    <NFTProviderContext.Provider value={props}>
      {props.children}
    </NFTProviderContext.Provider>
  );
}
