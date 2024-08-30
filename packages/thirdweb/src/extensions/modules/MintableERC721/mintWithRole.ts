import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {} from "../../../utils/date.js";
import { padHex } from "../../../utils/encoding/hex.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { startTokenId } from "../../erc721/__generated__/IERC721A/read/startTokenId.js";
import { totalMinted } from "../__generated__/ERC721Core/read/totalMinted.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";
import { encodeBytesBeforeMintERC721Params } from "../__generated__/MintableERC721/encode/encodeBytesBeforeMintERC721.js";

export type NFTMintParams = {
  to: string;
  nfts: (NFTInput | string)[];
};

export function mintWithRole(options: BaseTransactionOptions<NFTMintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const start = await startTokenId({ contract: options.contract });
      const minted = await totalMinted({ contract: options.contract });
      const nextIdToMint = start + minted;

      const batchOfUris = await uploadOrExtractURIs(
        options.nfts,
        options.contract.client,
        Number(nextIdToMint),
      );
      const baseURI = getBaseUriFromBatch(batchOfUris);

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: padHex("0x", { size: 32 }),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        baseURI: "",
      };

      return {
        to: options.to,
        quantity: BigInt(options.nfts.length),
        data: encodeBytesBeforeMintERC721Params({
          params: {
            request: emptyPayload,
            signature: "0x",
            baseURI,
          },
        }),
      };
    },
  });
}
