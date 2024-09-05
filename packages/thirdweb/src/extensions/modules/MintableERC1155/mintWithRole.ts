import { maxUint256 } from "viem";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";

export type EditionMintParams = {
  to: string;
  amount: bigint;
  nft: NFTInput | string;
  tokenId?: bigint;
};

export function mintWithRole(
  options: BaseTransactionOptions<EditionMintParams>,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const batchOfUris = await uploadOrExtractURIs(
        [options.nft],
        options.contract.client,
      );
      const baseURI = getBaseUriFromBatch(batchOfUris);

      const tokenId = options.tokenId ?? maxUint256;
      return {
        to: getAddress(options.to),
        tokenId,
        amount: options.amount,
        baseURI: baseURI,
        data: "0x",
      };
    },
  });
}
