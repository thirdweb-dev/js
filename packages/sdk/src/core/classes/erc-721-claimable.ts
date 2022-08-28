import { FEATURE_NFT_CLAIMABLE } from "../../constants/erc721-features";
import { NFTMetadataOwner } from "../../schema";
import { CustomContractSchema } from "../../schema/contracts/custom";
import { ClaimVerification } from "../../types";
import { BaseClaimConditionERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { TransactionTask } from "./TransactionTask";
import { ContractMetadata } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { DropClaimConditions } from "./drop-claim-conditions";
import { Erc721 } from "./erc-721";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/Drop";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers } from "ethers";

/**
 * Configure and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.drop.claim.to("0x...", quantity);
 * ```
 */
export class Erc721Claimable implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIMABLE.name;

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
   * await contract.nft.drop.claim.conditions.set(claimConditions);
   * ```
   */
  public conditions: DropClaimConditions<BaseClaimConditionERC721>;
  private contractWrapper: ContractWrapper<BaseClaimConditionERC721>;
  private erc721: Erc721;
  private storage: IStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseClaimConditionERC721>,
    storage: IStorage,
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
   * @param checkERC20Allowance
   * @param claimData
   */
  public async getClaimTransaction(
    destinationAddress: string,
    quantity: BigNumberish,
    checkERC20Allowance = true, // TODO split up allowance checks
    claimData?: ClaimVerification,
  ): Promise<TransactionTask> {
    let claimVerification = claimData;
    if (this.conditions && !claimData) {
      claimVerification = await this.conditions.prepareClaim(
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
   * Claim unique NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.nft.drop.claim.to(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * const claimedTokenId = tx[0].id; // the id of the first NFT claimed
   * const claimedNFT = await tx[0].data(); // (optional) get the first claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional claim verification data (e.g. price, allowlist proof, etc...)
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  public async to(
    destinationAddress: string,
    quantity: BigNumberish,
    checkERC20Allowance = true,
    claimData?: ClaimVerification,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    const task = await this.getClaimTransaction(
      destinationAddress,
      quantity,
      checkERC20Allowance,
      claimData,
    );
    const { receipt } = await task.execute();
    const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
      "TokensClaimed",
      receipt?.logs,
    );
    const startingIndex: BigNumber = event[0].args.startTokenId;
    const endingIndex = startingIndex.add(quantity);
    const results = [];
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
