import type { IMintableERC1155, IMulticall } from "@thirdweb-dev/contracts-js";
import { TokensMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TokenERC1155";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants } from "ethers";
import { NFT } from "../../../../../core/schema/nft";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import { uploadOrExtractURIs } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_EDITION_BATCH_MINTABLE } from "../../../../constants/erc1155-features";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import { EditionMetadataOrUri } from "../../../../schema/tokens/edition";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../../../types";
import { ContractEncoder } from "../../contract-encoder";
import { ContractWrapper } from "../contract-wrapper";
import type { Erc1155 } from "../../erc-1155";
import { Transaction } from "../../transactions";

/**
 * Mint Many ERC1155 NFTs at once
 * @remarks NFT batch minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.edition.mint.batch.to(walletAddress, [nftMetadataWithSupply1, nftMetadataWithSupply2, ...]);
 * ```
 * @public
 */

export class Erc1155BatchMintable implements DetectableFeature {
  featureName = FEATURE_EDITION_BATCH_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC1155 & IMulticall>;
  private erc1155: Erc1155;
  private storage: ThirdwebStorage;

  constructor(
    erc1155: Erc1155,
    contractWrapper: ContractWrapper<IMintableERC1155 & IMulticall>,
    storage: ThirdwebStorage,
  ) {
    this.erc1155 = erc1155;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Mint Many NFTs with limited supplies
   *
   * @remarks Mint many different NFTs with limited supplies to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata and supplies of your NFTs
   * const metadataWithSupply = [{
   *   supply: 50, // The number of this NFT you want to mint
   *   metadata: {
   *     name: "Cool NFT #1",
   *     description: "This is a cool NFT",
   *     image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   *   },
   * }, {
   *   supply: 100,
   *   metadata: {
   *     name: "Cool NFT #2",
   *     description: "This is a cool NFT",
   *     image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   *   },
   * }];
   *
   * const tx = await contract.edition.mint.batch.to(toAddress, metadataWithSupply);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadataWithSupply: EditionMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      const metadatas = metadataWithSupply.map((a) => a.metadata);
      const supplies = metadataWithSupply.map((a) => a.supply);
      const uris = await uploadOrExtractURIs(metadatas, this.storage);
      const resolvedAddress = await resolveAddress(to);
      const contractEncoder = new ContractEncoder(this.contractWrapper);
      const encoded = await Promise.all(
        uris.map(async (uri, index) =>
          contractEncoder.encode("mintTo", [
            resolvedAddress,
            constants.MaxUint256,
            uri,
            supplies[index],
          ]),
        ),
      );
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<TokensMintedEvent>(
            "TokensMinted",
            receipt.logs,
          );
          if (events.length === 0 || events.length < metadatas.length) {
            throw new Error("TokenMinted event not found, minting failed");
          }
          return events.map((e) => {
            const id = e.args.tokenIdMinted;
            return {
              id,
              receipt,
              data: () => this.erc1155.get(id),
            };
          });
        },
      });
    },
  );
}
