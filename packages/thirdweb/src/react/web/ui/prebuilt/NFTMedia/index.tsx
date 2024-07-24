import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../../contract/contract.js";
import { punkImageSvg } from "../../../../../extensions/cryptopunks/__generated__/OnchainCryptoPunks/read/punkImageSvg.js";
import { tokenURI } from "../../../../../extensions/erc721/__generated__/IERC721A/read/tokenURI.js";
import { uri } from "../../../../../extensions/erc1155/__generated__/IERC1155/read/uri.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";

export type NFTMediaProps = MediaRendererProps & {
  // The NFT contract address
  contractAddress: string;
  // The chain which the NFT contract was deployed on
  chain: Chain;
  // The tokenId whose media you want to load
  tokenId: bigint;

  /**
   * By standard format we look for the `image` field from the metadata (e.g: `const image = metadata.image`)
   * However, some contracts do not follow the standard. In that case users can use this field to override the default
   */
  overrideMediaField?: string;
};

/**
 * This component returns an [`MediaRenderer`](https://portal.thirdweb.com/references/typescript/v5/MediaRenderer) component
 * representing the media of an NFT (based on the tokenId & contract address that you give it)
 *
 * @param props NFTMediaProps
 * @returns a <MediaRenderer /> that shows the content of the NFT media
 *
 * @example
 * ```tsx
 * import { NFTMedia } from "thirdweb/react";
 *
 * <NFTMedia
 *   contractAddress="0x" // the NFT contract address
 *   tokenId={0n} // Get the image of the tokenId #0
 *   chain={ethereum}
 *   client={...}
 * />
 *
 * // --- Advanced use case ---
 * // Let's say the NFT has the following data:
 * const metadata = {
 *   name: "Name #1",
 *   image_data: "https://cat-image.png",
 * }
 *
 * // It will not work out-of-the-box with the <NFTMedia />  because
 * // by default, the component is looking for `image` and not `image_data`
 *
 * // In that case, you can override the default like this:
 *
 * <NFTMedia
 *   contractAddress="0x"
 *   tokenId={0n}
 *   chain={ethereum}
 *   client={...}
 *   overrideMediaField="image_data" // <---
 * />
 * ```
 *
 */
export async function NFTMedia(props: NFTMediaProps) {
  const {
    contractAddress,
    chain,
    client,
    tokenId,
    overrideMediaField,
    ...rest
  } = props;
  const contract = getContract({
    address: contractAddress,
    chain,
    client,
  });
  const src = await getNFTMedia({
    contract,
    client,
    tokenId,
    overrideMediaField,
  });
  return <MediaRenderer client={client} src={src} {...rest} />;
}

/**
 * @internal
 */
export async function getNFTMedia({
  contract,
  tokenId,
  overrideMediaField,
  client,
}: {
  contract: ThirdwebContract;
  tokenId: bigint;
  overrideMediaField?: string;
  client: ThirdwebClient;
}): Promise<string> {
  // No need to check whether a token is ERC721 or 1155. Because there are
  // other standards of NFT beside 721 and 1155 (404, onchain CryptoPunks etc.)
  // So we run all possible uri-fetching methods at once and use the one that's available
  const [_tokenURI, _uri, imageBase64, { fetchTokenMetadata }] =
    await Promise.all([
      tokenURI({ contract, tokenId }).catch(() => ""),
      uri({ contract, tokenId }).catch(() => ""),
      punkImageSvg({ contract, index: Number(tokenId) }).catch(() => ""),
      import("../../../../../utils/nft/fetchTokenMetadata.js"),
    ]);

  // Support for onchain CryptoPunks contract (or similar ones)
  if (imageBase64?.startsWith("data:image/")) {
    const dataStart = imageBase64.indexOf(",") + 1;
    return (
      imageBase64.slice(0, dataStart) +
        encodeURIComponent(imageBase64.slice(dataStart)) ?? ""
    );
  }
  const url = _tokenURI || _uri;
  if (!url) {
    throw new Error(
      `Could not get the URI for tokenId: ${tokenId}. Make sure the contract has the proper method to fetch it.`,
    );
  }
  const metadata = await fetchTokenMetadata({ client, tokenId, tokenUri: url });
  if (overrideMediaField) {
    if (typeof metadata[overrideMediaField] !== "string") {
      throw new Error(
        `Invalid value for ${overrideMediaField} - expected a string`,
      );
    }
    return metadata[overrideMediaField] ?? "";
  }
  return metadata.animation_url || metadata.image || "";
}
