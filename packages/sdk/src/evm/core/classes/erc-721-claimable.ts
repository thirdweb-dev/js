import { calculateClaimCost } from "../../common/claim-conditions";
import { FEATURE_NFT_CLAIMABLE } from "../../constants/erc721-features";
import { NFTMetadataOwner } from "../../schema";
import { ClaimOptions } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { TransactionTask } from "./TransactionTask";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721 } from "./erc-721";
import type { IClaimableERC721 } from "@thirdweb-dev/contracts-js";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/IClaimableERC721";
import { BigNumber, BigNumberish, CallOverrides } from "ethers";

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
  featureName = FEATURE_NFT_CLAIMABLE.name;

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
   */
  public async getClaimTransaction(
    destinationAddress: string,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionTask> {
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
    return TransactionTask.make({
      contractWrapper: this.contractWrapper,
      functionName: "claim",
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
   * const tokenId = 0; // the id of the NFT you want to claim
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.erc721.claimTo(address, tokenId, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Options for claiming the NFTs
   *
   * @returns - Receipt for the transaction
   */
  public async to(
    destinationAddress: string,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
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
    const results: TransactionResultWithId<NFTMetadataOwner>[] = [];
    for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.erc721.get(id),
      });
    }
    return results;
  }
}
