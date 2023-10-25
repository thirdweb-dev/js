import type { NFT } from "../../../core/schema/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_CLAIM_CONDITIONS_V2 } from "../../constants/erc721-features";
import type { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type { ClaimOptions } from "../../types/claim-conditions/claim-conditions";
import type { BaseClaimConditionERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import type { TransactionResultWithId } from "../types";
import type { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish } from "ethers";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDrop";
import { CustomContractSchema } from "../../schema/contracts/custom";
import { ContractMetadata } from "./contract-metadata";
import { DropClaimConditions } from "./drop-claim-conditions";
import { getErc721Token } from "../../contracts/erc721Methods";

/**
 * Configure and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.claim(quantity);
 * await contract.erc721.claimConditions.getActive();
 * ```
 */

export class Erc721ClaimableWithConditions implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIM_CONDITIONS_V2.name;

  /**
   * Configure claim conditions
   * @remarks Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxClaimableSupply: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.08, // public sale price
   *   }
   * ]);
   * await contract.erc721.claimConditions.set(claimConditions);
   * ```
   */
  public conditions: DropClaimConditions<BaseClaimConditionERC721>;
  private contractWrapper: ContractWrapper<BaseClaimConditionERC721>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<BaseClaimConditionERC721>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    const metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );
    this.conditions = new DropClaimConditions(
      this.contractWrapper,
      metadata,
      this.storage,
    );
  }

  /**
   * Claim unique NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.erc721.claimTo(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * const claimedTokenId = tx[0].id; // the id of the first NFT claimed
   * const claimedNFT = await tx[0].data(); // (optional) get the first claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      // TODO: Transaction Sequence Pattern
      const tx = (await this.conditions.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      )) as any as Transaction<TransactionResultWithId<NFT>[]>;
      tx.setParse((receipt) => {
        const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
          "TokensClaimed",
          receipt?.logs,
        );
        const startingIndex: BigNumber = event[0].args.startTokenId;
        const endingIndex = startingIndex.add(quantity);
        const results: TransactionResultWithId<NFT>[] = [];
        for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
          results.push({
            id,
            receipt,
            data: () => getErc721Token(id, this.contractWrapper, this.storage),
          });
        }
        return results;
      });

      return tx;
    },
  );
}
