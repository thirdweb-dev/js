import { NFT } from "../../../core/schema/nft";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { uploadOrExtractURI } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_EDITION_MINTABLE } from "../../constants/erc1155-features";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { EditionMetadataOrUri } from "../../schema/tokens/edition";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { IMintableERC1155 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, type BigNumberish, constants } from "ethers";
import type { IMulticall } from "@thirdweb-dev/contracts-js";
import { TransferSingleEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ITokenERC1155";
import type { Erc1155 } from "./erc-1155";
import { Erc1155BatchMintable } from "./erc-1155-batch-mintable";

/**
 * Mint ERC1155 NFTs
 * @remarks NFT minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.edition.mint.to(walletAddress, nftMetadata);
 * ```
 * @public
 */

export class Erc1155Mintable implements DetectableFeature {
  featureName = FEATURE_EDITION_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC1155>;
  private erc1155: Erc1155;
  private storage: ThirdwebStorage;

  /**
   * Batch mint Tokens to many addresses
   */
  public batch: Erc1155BatchMintable | undefined;

  constructor(
    erc1155: Erc1155,
    contractWrapper: ContractWrapper<IMintableERC1155>,
    storage: ThirdwebStorage,
  ) {
    this.erc1155 = erc1155;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.batch = this.detectErc1155BatchMintable();
  }

  /**
   * Mint an NFT with a limited supply
   *
   * @remarks Mint an NFT with a limited supply to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }
   *
   * const metadataWithSupply = {
   *   metadata,
   *   supply: 1000, // The number of this NFT you want to mint
   * }
   *
   * const tx = await contract.edition.mint.to(toAddress, metadataWithSupply);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   *
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadataWithSupply: EditionMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const tx = (await this.getMintTransaction(
        to,
        metadataWithSupply,
      )) as any as Transaction<TransactionResultWithId<NFT>>;
      tx.setParse((receipt) => {
        const event = this.contractWrapper.parseLogs<TransferSingleEvent>(
          "TransferSingle",
          receipt?.logs,
        );
        if (event.length === 0) {
          throw new Error("TransferSingleEvent event not found");
        }
        const id = event[0].args.id;
        return {
          id,
          receipt,
          data: () => this.erc1155.get(id.toString()),
        };
      });
      return tx;
    },
  );

  /**
   * @deprecated Use `contract.erc1155.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    to: AddressOrEns,
    metadataWithSupply: EditionMetadataOrUri,
  ): Promise<Transaction> {
    const [uri, toAddress] = await Promise.all([
      uploadOrExtractURI(metadataWithSupply.metadata, this.storage),
      resolveAddress(to),
    ]);
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "mintTo",
      args: [toAddress, constants.MaxUint256, uri, metadataWithSupply.supply],
    });
  }

  /**
   * Increase the supply of an existing NFT and mint it to a given wallet address
   *
   * @param to - the address to mint to
   * @param tokenId - the token id of the NFT to increase supply of
   * @param additionalSupply - the additional amount to mint
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   * const tokenId = 0;
   * const additionalSupply = 1000;
   *
   * const tx = await contract.edition.mint.additionalSupplyTo(toAddress, tokenId, additionalSupply);
   * ```
   */
  additionalSupplyTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      tokenId: BigNumberish,
      additionalSupply: BigNumberish,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const [metadata, toAddress] = await Promise.all([
        this.erc1155.getTokenMetadata(tokenId),
        resolveAddress(to),
      ]);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "mintTo",
        args: [toAddress, tokenId, metadata.uri, additionalSupply],
        parse: (receipt) => {
          return {
            id: BigNumber.from(tokenId),
            receipt,
            data: () => this.erc1155.get(tokenId),
          };
        },
      });
    },
  );

  private detectErc1155BatchMintable() {
    if (
      detectContractFeature<IMintableERC1155 & IMulticall>(
        this.contractWrapper,
        "ERC1155BatchMintable",
      )
    ) {
      return new Erc1155BatchMintable(
        this.erc1155,
        this.contractWrapper,
        this.storage,
      );
    }
  }
}
