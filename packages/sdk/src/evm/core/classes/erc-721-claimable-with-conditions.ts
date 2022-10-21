import { NFT } from "../../../core/schema/nft";
import { hasFunction } from "../../common";
import { isPrebuilt } from "../../common/legacy";
import { FEATURE_NFT_CLAIMABLE_WITH_CONDITIONS } from "../../constants/erc721-features";
import { CustomContractSchema } from "../../schema/contracts/custom";
import { ClaimOptions, ClaimVerification } from "../../types";
import { BaseClaimConditionERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { TransactionTask } from "./TransactionTask";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { DropClaimConditions } from "./drop-claim-conditions";
import { Erc721 } from "./erc-721";
import type { DropERC721 } from "@thirdweb-dev/contracts-js";
import { IDropSinglePhase_V1 } from "@thirdweb-dev/contracts-js";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/Drop";
import { IDropSinglePhase } from "@thirdweb-dev/contracts-js/src/DropSinglePhase";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers } from "ethers";

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
  featureName = FEATURE_NFT_CLAIMABLE_WITH_CONDITIONS.name;

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
   *     maxQuantity: 2, // limit how many mints for this presale
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
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseClaimConditionERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
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
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress
   * @param quantity
   * @param options
   */
  public async getClaimTransaction(
    destinationAddress: string,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionTask> {
    if (options?.pricePerToken) {
      throw new Error(
        "In ERC721ClaimableWithConditions, price per token is be set via claim conditions by calling `contract.erc721.claimConditions.set()`",
      );
    }
    const claimVerification = await this.conditions.prepareClaim(
      quantity,
      options?.checkERC20Allowance === undefined
        ? true
        : options.checkERC20Allowance,
    );

    return TransactionTask.make({
      contractWrapper: this.contractWrapper,
      functionName: "claim",
      args: await this.getArgs(destinationAddress, quantity, claimVerification),
      overrides: claimVerification.overrides,
    });
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
  public async to(
    destinationAddress: string,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionResultWithId<NFT>[]> {
    const task = await this.getClaimTransaction(
      destinationAddress,
      quantity,
      options,
    );
    const { receipt } = await task.execute();
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
        data: () => this.erc721.get(id),
      });
    }
    return results;
  }

  private async getArgs(
    destinationAddress: string,
    quantity: BigNumberish,
    claimVerification: ClaimVerification,
  ): Promise<any[]> {
    if (this.conditions.isLegacyMultiPhaseDrop(this.contractWrapper)) {
      return [
        destinationAddress,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        claimVerification.proofs,
        claimVerification.maxClaimable,
      ];
    } else if (this.conditions.isLegacySinglePhaseDrop(this.contractWrapper)) {
      return [
        destinationAddress,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        {
          proof: claimVerification.proofs,
          maxQuantityInAllowlist: claimVerification.maxClaimable,
        } as IDropSinglePhase_V1.AllowlistProofStruct,
        ethers.utils.toUtf8Bytes(""),
      ];
    }
    return [
      destinationAddress,
      quantity,
      claimVerification.currencyAddress,
      claimVerification.price,
      {
        proof: claimVerification.proofs,
        quantityLimitPerWallet: claimVerification.maxClaimable,
        pricePerToken: claimVerification.price,
        currency: claimVerification.currencyAddress,
      } as IDropSinglePhase.AllowlistProofStruct,
      ethers.utils.toUtf8Bytes(""),
    ];
  }
}
