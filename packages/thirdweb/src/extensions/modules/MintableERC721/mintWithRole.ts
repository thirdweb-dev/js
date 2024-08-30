import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import {} from "../../../utils/date.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { startTokenId } from "../../erc721/__generated__/IERC721A/read/startTokenId.js";
import { totalMinted } from "../__generated__/ERC721Core/read/totalMinted.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";

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

      return {
        to: getAddress(options.to),
        amount: BigInt(options.nfts.length),
        baseURI,
        data: "0x",
      };
    },
  });
}
