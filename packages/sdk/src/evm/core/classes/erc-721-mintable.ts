import type { NFT, NFTMetadataOrUri } from "../../../core/schema/nft";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_MINTABLE } from "../../constants/erc721-features";
import type { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import type { TransactionResultWithId } from "../types";
import type { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { IMintableERC721 } from "@thirdweb-dev/contracts-js";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { uploadOrExtractURI } from "../../common/nft";
import type { IMulticall } from "@thirdweb-dev/contracts-js";
import { TransferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ITokenERC721";
import type { Erc721 } from "./erc-721";
import { Erc721BatchMintable } from "./erc-721-batch-mintable";

/**
 * Mint ERC721 NFTs
 * @remarks NFT minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.mint.to(walletAddress, nftMetadata);
 * ```
 * @public
 */

export class Erc721Mintable implements DetectableFeature {
  featureName = FEATURE_NFT_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC721>;
  private storage: ThirdwebStorage;
  private erc721: Erc721;

  public batch: Erc721BatchMintable | undefined;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IMintableERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.batch = this.detectErc721BatchMintable();
  }

  /**
   * Mint a unique NFT
   *
   * @remarks Mint a unique NFT to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const walletAddress = "{{wallet_address}}";
   *
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const tx = await contract.nft.mint.to(walletAddress, metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadata: NFTMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const [uri, toAddress] = await Promise.all([
        uploadOrExtractURI(metadata, this.storage),
        resolveAddress(to),
      ]);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "mintTo",
        args: [toAddress, uri],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TransferEvent>(
            "Transfer",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("TransferEvent event not found");
          }
          const id = event[0].args.tokenId;
          return {
            id,
            receipt,
            data: () => this.erc721.get(id),
          };
        },
      });
    },
  );

  /**
   * @deprecated Use `contract.erc721.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    to: AddressOrEns,
    metadata: NFTMetadataOrUri,
  ): Promise<Transaction> {
    return this.to.prepare(await resolveAddress(to), metadata);
  }

  private detectErc721BatchMintable(): Erc721BatchMintable | undefined {
    if (
      detectContractFeature<IMintableERC721 & IMulticall>(
        this.contractWrapper,
        "ERC721BatchMintable",
      )
    ) {
      return new Erc721BatchMintable(
        this.erc721,
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }
}
