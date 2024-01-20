import { transaction } from "../../../transaction/index.js";
import type { ThirdwebContract } from "../../../contract/index.js";
import type { FileOrBufferOrString } from "../../../storage/upload/types.js";

export type NFTInput = {
  name?: string;
  description?: string;
  image?: FileOrBufferOrString;
  animation_url?: FileOrBufferOrString;
  external_url?: FileOrBufferOrString;
  background_color?: string;
  // TODO check if we truly need both of these?
  properties?: Record<string, unknown> | Array<Record<string, unknown>>;
} & Record<string, unknown>;

export type MintToParams = {
  to: string;
  nft: NFTInput | string;
};

export function mintTo(contract: ThirdwebContract, params: MintToParams) {
  return transaction(contract, {
    address: contract.address,
    chainId: contract.chainId,
    method: "function mintTo(address _to, string memory _tokenURI)",
    params: async () => {
      let tokenUri: string;

      if (typeof params.nft === "string") {
        // if the input is already a string then we just use that
        tokenUri = params.nft;
      } else {
        // otherwise we need to upload the file to the storage server

        tokenUri = (
          await contract.storage.upload({
            files: [params.nft],
          })
        )[0] as string;
      }
      return [params.to, tokenUri] as const;
    },
  });
}
