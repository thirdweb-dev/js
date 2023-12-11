import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_TOKEN_CLAIM_CONDITIONS_V2 } from "../../../../constants/erc20-features";
import type { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { ClaimOptions } from "../../../../types/claim-conditions/claim-conditions";
import type { Amount } from "../../../../types/currency";
import type { BaseDropERC20 } from "../../../../types/eips";
import type { DetectableFeature } from "../../../interfaces/DetectableFeature";
import type { ContractWrapper } from "../contract-wrapper";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CustomContractSchema } from "../../../../schema/contracts/custom";
import { ContractMetadata } from "../../contract-metadata";
import { DropClaimConditions } from "../../drop-claim-conditions";
import type { Erc20 } from "../../erc-20";

/**
 * Configure and claim ERC20 tokens
 * @remarks Manage claim phases and claim ERC20 tokens that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.drop.claim.to("0x...", quantity);
 * ```
 */

export class Erc20ClaimableWithConditions implements DetectableFeature {
  featureName = FEATURE_TOKEN_CLAIM_CONDITIONS_V2.name;
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
   * await contract.token.drop.claim.conditions.set(claimConditions);
   * ```
   */
  public conditions: DropClaimConditions<BaseDropERC20>;
  private contractWrapper: ContractWrapper<BaseDropERC20>;
  private erc20: Erc20;
  private storage: ThirdwebStorage;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<BaseDropERC20>,
    storage: ThirdwebStorage,
  ) {
    this.erc20 = erc20;
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
   * Claim a certain amount of tokens to a specific Wallet
   *
   * @remarks Let the specified wallet claim Tokens.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 42.69; // how many tokens you want to claim
   *
   * const tx = await contract.token.drop.claim.to(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param amount - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional, data to pass to the claim function
   * @returns - The transaction receipt
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      amount: Amount,
      options?: ClaimOptions,
    ) => {
      const quantity = await this.erc20.normalizeAmount(amount);
      return await this.conditions.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      );
    },
  );
}
