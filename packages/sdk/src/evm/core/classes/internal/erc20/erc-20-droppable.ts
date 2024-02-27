import type { BaseDropERC20 } from "../../../../types/eips";
import type { ContractWrapper } from "../contract-wrapper";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { Erc20 } from "../../erc-20";
import { Erc20ClaimableWithConditions } from "./erc-20-claim-conditions";

/**
 * Configure and claim ERC20 tokens
 * @remarks Manage claim phases and claim ERC20 tokens that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.drop.claim.to("0x...", quantity);
 * ```
 */

export class Erc20Droppable {
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
   * await contract.nft.drop.claim.conditions.set(claimConditions);
   * ```
   */
  public claim: Erc20ClaimableWithConditions;
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
    this.claim = new Erc20ClaimableWithConditions(
      this.erc20,
      this.contractWrapper,
      this.storage,
    );
  }
}
