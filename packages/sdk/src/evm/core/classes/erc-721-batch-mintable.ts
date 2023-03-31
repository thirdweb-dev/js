import { NFT, NFTMetadataOrUri } from "../../../core/schema/nft";
import { resolveAddress } from "../../common/ens";
import { uploadOrExtractURIs } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_BATCH_MINTABLE } from "../../constants/erc721-features";
import { AddressOrEns } from "../../schema";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721 } from "./erc-721";
import { Transaction } from "./transactions";
import type { IMintableERC721, IMulticall } from "@thirdweb-dev/contracts-js";
import { TokensMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/IMintableERC721";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * Mint Many ERC721 NFTs at once
 * @remarks NFT batch minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.mint.batch.to(walletAddress, [nftMetadata1, nftMetadata2, ...]);
 * ```
 * @public
 */
export class Erc721BatchMintable implements DetectableFeature {
  featureName = FEATURE_NFT_BATCH_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC721 & IMulticall>;
  private storage: ThirdwebStorage;
  private erc721: Erc721;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IMintableERC721 & IMulticall>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Mint Many unique NFTs
   *
   * @remarks Mint many unique NFTs at once to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const walletAddress = "{{wallet_address}}";
   *
   * // Custom metadata of the NFTs you want to mint.
   * const metadatas = [{
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT #2",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/other/image.png"),
   * }];
   *
   * const tx = await contract.mint.batch.to(walletAddress, metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  to = buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadatas: NFTMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      const uris = await uploadOrExtractURIs(metadatas, this.storage);
      const resolvedAddress = await resolveAddress(to);
      const encoded = await Promise.all(
        uris.map(async (uri) =>
          this.contractWrapper.readContract.interface.encodeFunctionData(
            "mintTo",
            [resolvedAddress, uri],
          ),
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
              data: () => this.erc721.get(id),
            };
          });
        },
      });
    },
  );
}
