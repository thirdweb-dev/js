import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_EDITION_CLAIM_CONDITIONS_V2 } from "../../../../constants/erc1155-features";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import { CustomContractSchema } from "../../../../schema/contracts/custom";
import { ClaimOptions } from "../../../../types/claim-conditions/claim-conditions";
import { BaseClaimConditionERC1155 } from "../../../../types/eips";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractMetadata } from "../../contract-metadata";
import { ContractWrapper } from "../contract-wrapper";
import { DropErc1155ClaimConditions } from "../../drop-erc1155-claim-conditions";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish } from "ethers";

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
  featureName = FEATURE_EDITION_CLAIM_CONDITIONS_V2.name;

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
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      tokenId: BigNumberish,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ) => {
      return await this.conditions.getClaimTransaction(
        destinationAddress,
        tokenId,
        quantity,
        options,
      );
    },
  );
}
