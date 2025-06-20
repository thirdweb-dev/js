import { encodePacked } from "viem/utils";
import { upload } from "../../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../utils/abi/encodeAbiParameters.js";
import { toHex } from "../../../../utils/encoding/hex.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
import { getBaseUriFromBatch } from "../../../../utils/ipfs.js";
import type { NFTInput } from "../../../../utils/nft/parseNft.js";
import {
  getBaseURICount,
  isGetBaseURICountSupported,
} from "../../__generated__/IBatchMintMetadata/read/getBaseURICount.js";
import {
  encryptDecrypt,
  isEncryptDecryptSupported,
} from "../../__generated__/IDelayedReveal/read/encryptDecrypt.js";
import { nextTokenIdToMint } from "../../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import {
  lazyMint as generatedLazyMint,
  isLazyMintSupported,
} from "../../__generated__/ILazyMint/write/lazyMint.js";
import { hashDelayedRevealPassword } from "../helpers/hashDelayedRevealBatch.js";

/**
 * @extension ERC721
 */
export type CreateDelayedRevealBatchParams = {
  placeholderMetadata: NFTInput;
  metadata: NFTInput[];
  password: string;
};

/**
 * Creates a batch of encrypted NFTs that can be revealed at a later time.
 * This method is only available on the `DropERC721` contract.
 *
 * @param options {CreateDelayedRevealBatchParams} - The delayed reveal options.
 * @param options.placeholderMetadata {@link NFTInput} - The placeholder metadata for the batch.
 * @param options.metadata {@link NFTInput} - An array of NFT metadata to be revealed at a later time.
 * @param options.password {string} - The password for the reveal.
 * @param options.contract {@link ThirdwebContract} - The NFT contract instance.
 *
 * @returns The prepared transaction to send.
 *
 * @extension ERC721
 * @example
 * ```ts
 * import { createDelayedRevealBatch } from "thirdweb/extensions/erc721";
 *
 * const placeholderNFT = {
 *   name: "Hidden NFT",
 *   description: "Will be revealed next week!"
 * };
 *
 * const realNFTs = [{
 *   name: "Common NFT #1",
 *   description: "Common NFT, one of many.",
 *   image: ipfs://...,
 * }, {
 *   name: "Super Rare NFT #2",
 *   description: "You got a Super Rare NFT!",
 *   image: ipfs://...,
 * }];
 *
 * const transaction = createDelayedRevealBatch({
 *  contract,
 *  placeholderMetadata: placeholderNFT,
 *  metadata: realNFTs,
 *  password: "password123",
 * });
 *
 * const { transactionHash } = await sendTransaction({ transaction, account });
 * ```
 */
export function createDelayedRevealBatch(
  options: BaseTransactionOptions<CreateDelayedRevealBatchParams>,
) {
  if (!options.password) {
    throw new Error("Password is required");
  }

  return generatedLazyMint({
    asyncParams: async () => {
      const [placeholderUris, startFileNumber] = await Promise.all([
        upload({
          client: options.contract.client,
          files: Array(options.metadata.length).fill(
            options.placeholderMetadata,
          ),
        }),
        nextTokenIdToMint({
          contract: options.contract,
        }),
      ]);
      const placeholderUri = getBaseUriFromBatch(placeholderUris);

      const uris = await upload({
        client: options.contract.client,
        files: options.metadata,
        // IMPORTANT: File number has to be calculated properly otherwise the whole batch will break
        // e.g: If you are uploading a second batch, the file name should never start from `0`
        rewriteFileNames: {
          fileStartNumber: Number(startFileNumber),
        },
      });

      const baseUri = getBaseUriFromBatch(uris);
      const baseUriId = await getBaseURICount({
        contract: options.contract,
      });

      const hashedPassword = await hashDelayedRevealPassword(
        baseUriId,
        options.password,
        options.contract,
      );
      const encryptedBaseURI = await encryptDecrypt({
        contract: options.contract,
        data: toHex(baseUri),
        key: hashedPassword,
      });

      const chainId = BigInt(options.contract.chain.id);
      const provenanceHash = keccak256(
        encodePacked(
          ["bytes", "bytes", "uint256"],
          [toHex(baseUri), hashedPassword, chainId],
        ),
      );
      const data = encodeAbiParameters(
        [
          { name: "baseUri", type: "bytes" },
          { name: "provenanceHash", type: "bytes32" },
        ],
        [encryptedBaseURI, provenanceHash],
      );

      return {
        amount: BigInt(options.metadata.length),
        baseURIForTokens:
          placeholderUri.slice(-1) === "/"
            ? placeholderUri
            : `${placeholderUri}/`,
        extraData: data,
      } as const;
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `createDelayedRevealBatch` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createDelayedRevealBatch` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isCreateDelayedRevealBatchSupported } from "thirdweb/extensions/erc721";
 * const supported = isCreateDelayedRevealBatchSupported(["0x..."]);
 * ```
 */
export function isCreateDelayedRevealBatchSupported(
  availableSelectors: string[],
) {
  return [
    isGetBaseURICountSupported(availableSelectors),
    isEncryptDecryptSupported(availableSelectors),
    isLazyMintSupported(availableSelectors),
  ].every(Boolean);
}
