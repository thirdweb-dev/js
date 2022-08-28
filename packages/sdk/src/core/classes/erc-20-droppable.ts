import { FEATURE_TOKEN_DROPPABLE } from "../../constants/erc20-features";
import { BaseDropERC20 } from "../../types/eips";
import { IStorage } from "@thirdweb-dev/storage";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20 } from "./erc-20";
import { Erc20Claimable } from "./erc-20-claimable";

/**
 * Configure and claim ERC20 tokens
 * @remarks Manage claim phases and claim ERC20 tokens that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.drop.claim.to("0x...", quantity);
 * ```
 */
export class Erc20Droppable implements DetectableFeature {
  featureName = FEATURE_TOKEN_DROPPABLE.name;

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
  public claim: Erc20Claimable;
  private contractWrapper: ContractWrapper<BaseDropERC20>;
  private erc20: Erc20;
  private storage: IStorage;

  constructor(
    erc20: Erc20,
    contractWrapper: ContractWrapper<BaseDropERC20>,
    storage: IStorage,
  ) {
    this.erc20 = erc20;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    this.claim = new Erc20Claimable(
      this.erc20,
      this.contractWrapper,
      this.storage,
    );
  }
}
