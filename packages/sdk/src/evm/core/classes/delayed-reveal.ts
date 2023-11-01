import type {
  DropERC721_V3,
  IThirdwebContract,
  SignatureDrop,
} from "@thirdweb-dev/contracts-js";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/DropERC721";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, Contract, utils, type BigNumberish } from "ethers";
import {
  CommonNFTInput,
  NFTMetadata,
  NFTMetadataInput,
} from "../../../core/schema/nft";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import {
  fetchTokenMetadataForContract,
  getBaseUriFromBatch,
} from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FeatureName } from "../../constants/contract-features";
import type { BatchToReveal } from "../../types/delayed-reveal";
import {
  BaseDelayedRevealERC1155,
  BaseDelayedRevealERC721,
} from "../../types/eips";
import type { UploadProgressEvent } from "../../types/events";
import type { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * Handles delayed reveal logic
 * @public
 */
export class DelayedReveal<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TO BE REMOVED IN V4
  T extends
    | DropERC721_V3
    | BaseDelayedRevealERC721
    | SignatureDrop
    | BaseDelayedRevealERC1155,
> {
  featureName;

  private contractWrapper;
  private storage: ThirdwebStorage;
  private nextTokenIdToMintFn: () => Promise<BigNumber>;

  constructor(
    contractWrapper: ContractWrapper<
      | DropERC721_V3
      | BaseDelayedRevealERC721
      | SignatureDrop
      | BaseDelayedRevealERC1155
    >,
    storage: ThirdwebStorage,
    featureName: FeatureName,
    nextTokenIdToMintFn: () => Promise<BigNumber>,
  ) {
    this.featureName = featureName;
    this.nextTokenIdToMintFn = nextTokenIdToMintFn;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Create a batch of encrypted NFTs that can be revealed at a later time.
   * @remarks Create a batch of encrypted NFTs that can be revealed at a later time.
   * @example
   * ```javascript
   * // the real NFTs, these will be encrypted until your reveal them!
   * const realNFTs = [{
   *   name: "Common NFT #1",
   *   description: "Common NFT, one of many.",
   *   image: fs.readFileSync("path/to/image.png"),
   * }, {
   *   name: "Super Rare NFT #2",
   *   description: "You got a Super Rare NFT!",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   * // A placeholder NFT that people will get immediately in their wallet, until the reveal happens!
   * const placeholderNFT = {
   *   name: "Hidden NFT",
   *   description: "Will be revealed next week!"
   * };
   * // Create and encrypt the NFTs
   * await contract.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * ```
   * @public
   * @param placeholder - the placeholder NFT to show before the reveal
   * @param metadatas - the final NFTs that will be hidden
   * @param password - the password that will be used to reveal these NFTs
   * @param options - additional options like upload progress
   */
  createDelayedRevealBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      placeholder: NFTMetadataInput,
      metadatas: NFTMetadataInput[],
      password: string,
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      if (!password) {
        throw new Error("Password is required");
      }

      const [placeholderUris, startFileNumber, baseUriId, legacyContract] =
        await Promise.all([
          this.storage.uploadBatch([CommonNFTInput.parse(placeholder)], {
            rewriteFileNames: {
              fileStartNumber: 0,
            },
          }),
          this.nextTokenIdToMintFn(),
          this.contractWrapper.read("getBaseURICount", []),
          this.isLegacyContract(),
        ]);
      const placeholderUri = getBaseUriFromBatch(placeholderUris);

      const uris = await this.storage.uploadBatch(
        metadatas.map((m) => CommonNFTInput.parse(m)),
        {
          onProgress: options?.onProgress,
          rewriteFileNames: {
            fileStartNumber: startFileNumber.toNumber(),
          },
        },
      );

      const baseUri = getBaseUriFromBatch(uris);
      const hashedPassword = await this.hashDelayRevealPassword(
        baseUriId,
        password,
      );
      const encryptedBaseUri = await this.contractWrapper.read(
        "encryptDecrypt",
        [utils.toUtf8Bytes(baseUri), hashedPassword],
      );

      let data: string;
      if (legacyContract) {
        data = encryptedBaseUri;
      } else {
        const chainId = await this.contractWrapper.getChainID();
        const provenanceHash = utils.solidityKeccak256(
          ["bytes", "bytes", "uint256"],
          [utils.toUtf8Bytes(baseUri), hashedPassword, chainId],
        );
        data = utils.defaultAbiCoder.encode(
          ["bytes", "bytes32"],
          [encryptedBaseUri, provenanceHash],
        );
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          uris.length,
          placeholderUri.endsWith("/") ? placeholderUri : `${placeholderUri}/`,
          data,
        ],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
            "TokensLazyMinted",
            receipt?.logs,
          );
          const startingIndex = events[0].args.startTokenId;
          const endingIndex = events[0].args.endTokenId;
          const results: TransactionResultWithId[] = [];
          for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
            results.push({
              id,
              receipt,
            });
          }
          return results;
        },
      });
    },
  );

  /**
   * Reveal a batch of hidden NFTs
   * @remarks Reveal the NFTs of a batch using the password.
   * @example
   * ```javascript
   * // the batch to reveal
   * const batchId = 0;
   * // reveal the batch
   * await contract.revealer.reveal(batchId, "my secret password");
   * ```
   * @public
   * @param batchId - the id of the batch to reveal
   * @param password - the password
   */
  reveal = /* @__PURE__ */ buildTransactionFunction(
    async (batchId: BigNumberish, password: string): Promise<Transaction> => {
      if (!password) {
        throw new Error("Password is required");
      }
      const key = await this.hashDelayRevealPassword(batchId, password);
      // performing the reveal locally to make sure it'd succeed before sending the transaction
      try {
        const decryptedUri = await this.contractWrapper
          .callStatic()
          .reveal(batchId, key);
        // basic sanity check for making sure decryptedUri is valid
        // this is optional because invalid decryption key would result in non-utf8 bytes and
        // ethers would throw when trying to decode it
        if (!decryptedUri.includes("://") || !decryptedUri.endsWith("/")) {
          throw new Error("invalid password");
        }
      } catch (e) {
        throw new Error("invalid password");
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "reveal",
        args: [batchId, key],
      });
    },
  );

  /**
   * Gets the list of unrevealed NFT batches.
   * @remarks Gets the list of unrevealed NFT batches.
   * @example
   * ```javascript
   * const batches = await contract.revealer.getBatchesToReveal();
   * ```
   * @public
   */
  public async getBatchesToReveal(): Promise<BatchToReveal[]> {
    const count = await this.contractWrapper.read("getBaseURICount", []);
    if (count.isZero()) {
      return [];
    }

    const countRangeArray = Array.from(Array(count.toNumber()).keys());
    // map over to get the base uri indices, which should be the end token id of every batch
    const uriIndices = await Promise.all(
      countRangeArray.map((i) => {
        if (
          hasFunction<BaseDelayedRevealERC721>(
            "getBatchIdAtIndex",
            this.contractWrapper,
          )
        ) {
          return this.contractWrapper.read("getBatchIdAtIndex", [i]);
        }

        if (
          hasFunction<DropERC721_V3>("baseURIIndices", this.contractWrapper)
        ) {
          return this.contractWrapper.read("baseURIIndices", [i]);
        }

        throw new Error(
          "Contract does not have getBatchIdAtIndex or baseURIIndices.",
        );
      }),
    );

    // first batch always start from 0. don't need to fetch the last batch so pop it from the range array
    const uriIndicesWithZeroStart = uriIndices.slice(0, uriIndices.length - 1);

    // returns the token uri for each batches. first batch always starts from token id 0.
    const tokenMetadatas = await Promise.all(
      Array.from([0, ...uriIndicesWithZeroStart]).map((i) =>
        this.getNftMetadata(i.toString()),
      ),
    );

    // index is the uri indices, which is end token id. different from uris
    const legacyContract = await this.isLegacyContract();
    const encryptedUriData = await Promise.all(
      Array.from([...uriIndices]).map((i) =>
        legacyContract
          ? this.getLegacyEncryptedData(i)
          : this.contractWrapper.read("encryptedData", [i]),
      ),
    );
    const encryptedBaseUris = encryptedUriData.map((data) => {
      if (utils.hexDataLength(data) > 0) {
        if (legacyContract) {
          return data;
        }
        const result = utils.defaultAbiCoder.decode(["bytes", "bytes32"], data);
        return result[0];
      } else {
        return data;
      }
    });

    return tokenMetadatas
      .map((meta, index) => ({
        batchId: BigNumber.from(index),
        batchUri: meta.uri,
        placeholderMetadata: meta,
      }))
      .filter((_, index) => utils.hexDataLength(encryptedBaseUris[index]) > 0);
  }

  /**
   * Algorithm to hash delay reveal password, so we don't broadcast the input password on-chain.
   *
   * @internal
   */
  private async hashDelayRevealPassword(
    batchTokenIndex: BigNumberish,
    password: string,
  ) {
    const chainId = await this.contractWrapper.getChainID();
    const contractAddress = this.contractWrapper.address;
    return utils.solidityKeccak256(
      ["string", "uint256", "uint256", "address"],
      [password, chainId, batchTokenIndex, contractAddress],
    );
  }

  private async getNftMetadata(tokenId: BigNumberish): Promise<NFTMetadata> {
    return fetchTokenMetadataForContract(
      this.contractWrapper.address,
      this.contractWrapper.getProvider(),
      tokenId,
      this.storage,
    );
  }

  private async isLegacyContract(): Promise<boolean> {
    if (
      hasFunction<IThirdwebContract>("contractVersion", this.contractWrapper)
    ) {
      try {
        const version = await (
          this.contractWrapper as ContractWrapper<IThirdwebContract>
        ).read("contractVersion", []);
        return version <= 2;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  private async getLegacyEncryptedData(index: BigNumber) {
    const DeprecatedAbi = (
      await import(
        "@thirdweb-dev/contracts-js/dist/abis/IDelayedRevealDeprecated.json"
      )
    ).default;
    const legacy = new Contract(
      this.contractWrapper.address,
      DeprecatedAbi,
      this.contractWrapper.getProvider(),
    );
    const result = await legacy.functions["encryptedBaseURI"](index);
    if (result.length > 0) {
      return result[0];
    } else {
      return "0x";
    }
  }
}
