import type { Chain } from "../../../../../chains/types.js";
import { getContract } from "../../../../../contract/contract.js";
import { punkImageSvg } from "../../../../../extensions/cryptopunks/__generated__/OnchainCryptoPunks/read/punkImageSvg.js";
import { tokenURI } from "../../../../../extensions/erc721/__generated__/IERC721A/read/tokenURI.js";
import { uri } from "../../../../../extensions/erc1155/__generated__/IERC1155/read/uri.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";

type NFTMediaProps = MediaRendererProps & {
  // The NFT contract address
  contractAddress: Hex;
  // The chain which the NFT contract was deployed on
  chain: Chain;
  // The tokenId whose media you want to load
  tokenId: bigint;

  /**
   * By standard format we look for the `image` field from the metadata (e.g: `const image = metadata.image`)
   * However, some contracts do not follow the standard.
   * We allow them to override that rule.
   */
  overrideMediaField?: string;
};

/**
 * This component returns the media of an NFT.
 *
 * @param props
 * @returns
 *
 * @example
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

  // Support for onchain CryptoPunks contract
  if (imageBase64?.startsWith("data:image/")) {
    const dataStart = imageBase64.indexOf(",") + 1;
    return (
      <MediaRenderer
        client={client}
        src={
          imageBase64.slice(0, dataStart) +
            encodeURIComponent(imageBase64.slice(dataStart)) ?? ""
        }
        {...rest}
      />
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
    return (
      <MediaRenderer
        client={client}
        src={metadata[overrideMediaField] ?? null}
        {...rest}
      />
    );
  }
  const mediaURL = metadata.animation_url || metadata.image;
  return <MediaRenderer client={client} src={mediaURL} {...rest} />;
}
