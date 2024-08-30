import { padHex } from "viem";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {} from "../../../utils/date.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";
import { encodeBytesBeforeMintERC1155Params } from "../__generated__/MintableERC1155/encode/encodeBytesBeforeMintERC1155.js";

export type EditionMintParams = {
  to: string;
  amount: bigint;
  nft: NFTInput | string;
  tokenId: bigint; // TODO (modular) this should be optional
};

export function mintWithRole(
  options: BaseTransactionOptions<EditionMintParams>,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let metadataURI: string;
      if (typeof options.nft === "string") {
        // if the input is already a string then we just use that
        metadataURI = options.nft;
      } else {
        // otherwise we need to upload the file to the storage server
        // load the upload code if we need it
        const { upload } = await import("../../../storage/upload.js");
        metadataURI = await upload({
          client: options.contract.client,
          files: [options.nft],
        });
      }

      const tokenId = options.tokenId;
      const emptyPayload = {
        tokenId,
        pricePerUnit: 0n,
        quantity: 0n,
        uid: padHex("0x", { size: 32 }),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        metadataURI: "",
      };

      return {
        to: options.to,
        tokenId,
        value: options.amount,
        data: encodeBytesBeforeMintERC1155Params({
          params: {
            request: emptyPayload,
            signature: "0x",
            metadataURI,
          },
        }),
      };
    },
  });
}
