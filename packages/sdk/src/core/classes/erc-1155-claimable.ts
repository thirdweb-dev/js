import { DropErc1155ClaimConditions } from "./drop-erc1155-claim-conditions";
import { FEATURE_NFT_CLAIMABLE } from "../../constants/erc721-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { BaseClaimConditionERC1155 } from "../../types/eips";
import { IStorage } from "@thirdweb-dev/storage";
import { ContractWrapper } from "./contract-wrapper";
import { ContractMetadata } from "./contract-metadata";
import { CustomContractSchema } from "../../schema/contracts/custom";
import { ClaimVerification } from "../../types/claim-conditions/claim-conditions";
import { BigNumberish, ethers } from "ethers";
import { TransactionResult } from "../types";
import { TransactionTask } from "./TransactionTask";

export class Erc1155Claimable implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIMABLE.name;

  public conditions: DropErc1155ClaimConditions<BaseClaimConditionERC1155>;
  private contractWrapper: ContractWrapper<BaseClaimConditionERC1155>;
  private storage: IStorage;

  constructor(
    contractWrapper: ContractWrapper<BaseClaimConditionERC1155>,
    storage: IStorage,
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
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional claim verification data (e.g. price, allowlist proof, etc...)
   */
  public async getClaimTransaction(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true, // TODO split up allowance checks
    claimData?: ClaimVerification,
  ): Promise<TransactionTask> {
    let claimVerification = claimData;
    if (this.conditions && !claimData) {
      claimVerification = await this.conditions.prepareClaim(
        tokenId,
        quantity,
        checkERC20Allowance,
      );
    }
    if (!claimVerification) {
      throw new Error(
        "Claim verification Data is required - either pass it in as 'claimData' or set claim conditions via 'conditions.set()'",
      );
    }
    return TransactionTask.make({
      contractWrapper: this.contractWrapper,
      functionName: "claim",
      args: [
        destinationAddress,
        tokenId,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        {
          proof: claimVerification.proofs,
          maxQuantityInAllowlist: claimVerification.maxQuantityPerTransaction,
        },
        ethers.utils.toUtf8Bytes(""),
      ],
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
   * const tx = await contract.edition.drop.claim.to(address, tokenId, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional claim verification data (e.g. price, allowlist proof, etc...)
   *
   * @returns - Receipt for the transaction
   */
  public async to(
    destinationAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true,
    claimData?: ClaimVerification,
  ): Promise<TransactionResult> {
    const tx = await this.getClaimTransaction(
      destinationAddress,
      tokenId,
      quantity,
      checkERC20Allowance,
      claimData,
    );
    return await tx.execute();
  }
}
