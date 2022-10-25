import { hasFunction } from "../../common";
import { FEATURE_EDITION_CLAIMABLE_WITH_CONDITIONS } from "../../constants/erc1155-features";
import { CustomContractSchema } from "../../schema/contracts/custom";
import {
  ClaimCondition,
  ClaimOptions,
  ClaimVerification,
} from "../../types/claim-conditions/claim-conditions";
import { BaseClaimConditionERC1155 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult } from "../types";
import { TransactionTask } from "./TransactionTask";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { DropErc1155ClaimConditions } from "./drop-erc1155-claim-conditions";
import type { DropERC1155 } from "@thirdweb-dev/contracts-js";
import { IDropSinglePhase_V1 } from "@thirdweb-dev/contracts-js";
import { IDropSinglePhase } from "@thirdweb-dev/contracts-js/src/DropSinglePhase";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish, ethers } from "ethers";

/**
 * Configure and claim ERC1155 NFTs
 * @remarks Manage claim phases and claim ERC1155 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc1155.claim(tokenId, quantity);
 * await contract.erc1155.claimConditions.getActive(tokenId);
 * ```
 */
export class Erc1155ClaimableWithConditions implements DetectableFeature {
  featureName = FEATURE_EDITION_CLAIMABLE_WITH_CONDITIONS.name;

  public conditions: DropErc1155ClaimConditions<BaseClaimConditionERC1155>;
  private contractWrapper: ContractWrapper<BaseClaimConditionERC1155>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<BaseClaimConditionERC1155>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;

    const metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );
    this.conditions = new DropErc1155ClaimConditions(
      contractWrapper,
      metadata,
      this.storage,
    );
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   */
  public async getClaimTransaction(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionTask> {
    if (options?.pricePerToken) {
      throw new Error(
        "In ERC1155ClaimableWithConditions, price per token is be set via claim conditions by calling `contract.erc1155.claimConditions.set()`",
      );
    }
    const claimVerification = await this.conditions.prepareClaim(
      tokenId,
      quantity,
      options?.checkERC20Allowance || true,
    );
    return TransactionTask.make({
      contractWrapper: this.contractWrapper,
      functionName: "claim",
      args: await this.conditions.getClaimArguments(
        tokenId,
        destinationAddress,
        quantity,
        claimVerification,
      ),
      overrides: claimVerification.overrides,
    });
  }

  /**
   * Claim NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const tokenId = 0; // the id of the NFT you want to claim
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.erc1155.claimTo(address, tokenId, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   *
   * @returns - Receipt for the transaction
   */
  public async to(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionResult> {
    const tx = await this.getClaimTransaction(
      destinationAddress,
      tokenId,
      quantity,
      options,
    );
    return await tx.execute();
  }
}
