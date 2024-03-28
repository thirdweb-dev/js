import type { NFT } from "../../../../../core/schema/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_CLAIM_CUSTOM } from "../../../../constants/erc721-features";
import type { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { ClaimOptions } from "../../../../types/claim-conditions/claim-conditions";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import type { TransactionResultWithId } from "../../../types";
import type { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { IClaimableERC721 } from "@thirdweb-dev/contracts-js";
import { BigNumber, BigNumberish, CallOverrides } from "ethers";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDrop";
import { calculateClaimCost } from "../../../../common/claim-conditions/calculateClaimCost";
import type { Erc721 } from "../../erc-721";

/**
 * Configure and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.claim(tokenId, quantity);
 * ```
 */

export class Erc721Claimable implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIM_CUSTOM.name;

  private erc721: Erc721;
  private contractWrapper: ContractWrapper<IClaimableERC721>;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IClaimableERC721>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Options for claiming the NFTs
   *
   * @deprecated Use `contract.erc721.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<Transaction> {
    // TODO: Transaction Sequence Pattern
    let overrides: CallOverrides = {};
    if (options && options.pricePerToken) {
      overrides = await calculateClaimCost(
        this.contractWrapper,
        options.pricePerToken,
        quantity,
        options.currencyAddress,
        options.checkERC20Allowance,
      );
    }
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claim",
      args: [destinationAddress, quantity],
      overrides,
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
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.erc721.claimTo(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Options for claiming the NFTs
   *
   * @returns  Receipt for the transaction
   */
  to = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      // TODO: Transaction Sequence Pattern
      const tx = (await this.getClaimTransaction(
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
            data: () => this.erc721.get(id),
          });
        }
        return results;
      });
      return tx;
    },
  );
}
