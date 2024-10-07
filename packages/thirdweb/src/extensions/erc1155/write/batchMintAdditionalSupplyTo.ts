import { multicall } from "../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import * as URI from "../__generated__/IERC1155/read/uri.js";
import * as MintTo from "../__generated__/IMintableERC1155/write/mintTo.js";

export type BatchMintAdditionalSupplyToParams = {
  tokenId: bigint;
  content: Array<{
    to: string;
    supply: bigint;
  }>;
};

export function batchMintAdditionalSupplyTo(
  options: BaseTransactionOptions<BatchMintAdditionalSupplyToParams>,
) {
  return multicall({
    contract: options.contract,
    asyncParams: async () => {
      // we'll be re-using the exising token URI
      const tokenUri = await URI.uri({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      const data = options.content.map((item) =>
        MintTo.encodeMintTo({
          to: item.to,
          tokenId: options.tokenId,
          uri: tokenUri,
          amount: item.supply,
        }),
      );
      return { data };
    },
  });
}
