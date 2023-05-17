import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_STAKE } from "../../constants/thirdweb-features";
import { Address, AddressOrEns } from "../../schema";
import { Currency, CurrencyValue, Amount } from "../../types";
import { BaseERC20, BaseERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { NFTStake, Staking721Base } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import { BigNumberish } from "ethers";
import { Staking } from "./staking";

/**
 * Standard ERC721 Staking functions
 * @remarks Basic functionality for an ERC721 staking contract.
 * @example
 * ```javascript
 * // stake token IDs 1 and 2
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.staking721.stake([1, 2]);
 * ```
 * @public
 */
export class Staking721<T extends NFTStake | Staking721Base>
  extends Staking
  implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_NFT_STAKE.name;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;
  protected _rewardToken: ContractWrapper<BaseERC20> | undefined;
  protected _stakingToken: ContractWrapper<BaseERC721> | undefined;

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: ThirdwebStorage,
    chainId: number,
  ) {
    super();
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this._chainId = chainId;

    this.getContractWrappers();
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  ////// Standard Staking721 Extension //////

  // READ FUNCTIONS

  /**
   * Get the number of reward tokens in the staking contract
   *
   * @remarks Get the number of reward tokens the staking contract owns. To deposit reward tokens, use the `depositRewardTokens` function.
   *
   * @example
   * ```javascript
   * // Get reward token balance for staking contract
   * const balance = await contract.staking721.getRewardTokenBalance();
   * ```
   *
   * @returns Number of reward tokens, see {@link CurrencyValue}
   * @twfeature Staking721
   */
  public async getRewardTokenBalance(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardTokenBalance(),
    );
  }

  /**
   * Get information about reward token
   *
   * @example
   * ```javascript
   * // Get reward token info
   * const rewardToken = await contract.staking721.getRewardToken();
   * ```
   *
   * @returns see {@link Currency}
   * @twfeature Staking721
   */
  public async getRewardToken(): Promise<Currency & { address: string }> {
    return {
      ...(await fetchCurrencyMetadata(
        await this.contractWrapper.getProvider(),
        await this.contractWrapper.readContract.rewardToken(),
      )),
      address: await this.contractWrapper.readContract.rewardToken(),
    };
  }

  /**
   * Get address for the staking token
   *
   * @example
   * ```javascript
   * // Get staking token address
   * const rewardToken = await contract.staking721.getStakingTokenAddress();
   * ```
   *
   * @returns string
   * @twfeature Staking721
   */
  public async getStakingTokenAddress(): Promise<string> {
    return await this.contractWrapper.readContract.stakingToken();
  }

  /**
   * Get reward tokens rewarded per unit time
   *
   * @example
   * ```javascript
   * // Get rewards per unit time
   * const rewardToken = await contract.staking721.getRewardsPerUnitTime();
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking721
   */
  public async getRewardsPerUnitTime(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardsPerUnitTime(),
    );
  }

  /**
   * Get list of token IDs staked in an array
   *
   * @example
   * ```javascript
   * // Get tokens staked
   * const rewardToken = await contract.staking721.getTokensStaked("thirdweb.eth");
   * ```
   *
   * @returns see {@link BigNumber}
   * @twfeature Staking721
   */
  public async getTokensStaked(staker: AddressOrEns): Promise<BigNumberish[]> {
    return (await this.contractWrapper.readContract.getStakeInfo(staker))[0];
  }

  /**
   * Get amount of unclaimed reward tokens for a specific address or ENS
   *
   * @example
   * ```javascript
   * // Get unclaimed rewards
   * const rewardToken = await contract.staking721.getRewards("thirdweb.eth");
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking721
   */
  public async getRewards(address: AddressOrEns): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      (
        await this.contractWrapper.readContract.getStakeInfo(
          await resolveAddress(address),
        )
      )[1],
    );
  }

  /**
   * Get time unit for the staking contract
   *
   * @example
   * ```javascript
   * // Get tokens staked
   * const rewardToken = await contract.staking721.getTimeUnits()
   * ```
   *
   * @returns number
   * @twfeature Staking721
   */
  public async getTimeUnits(): Promise<number> {
    return (await this.contractWrapper.readContract.getTimeUnit()).toNumber();
  }

  // WRITE FUNCTIONS

  /**
   * Claim rewards and receive reward tokens.
   *
   * @example
   * ```javascript
   * // Claim rewards
   * const claim = await contract.staking721.claimRewards();
   * ```
   *
   * @twfeature Staking721
   */
  claimRewards = buildTransactionFunction(async () => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [],
    });
  });

  /**
   * Deposit reward tokens in the staking contract. Automatically fetches and seeks token transfer approval.
   *
   * @example
   * ```javascript
   * // Deposit reward tokens
   * const deposit = await contract.staking721.depositRewardTokens(500);
   * ```
   *
   * @twfeature Staking721
   */
  depositRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    // Approve spending of reward tokens
    await this.handleTokenApproval(
      await this.normalizeAmount(
        amount,
        this._rewardToken as ContractWrapper<BaseERC20>,
      ),
      await this.contractWrapper.getSignerAddress(),
      this.getAddress(),
      this._rewardToken as ContractWrapper<BaseERC20>,
    );

    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "depositRewardTokens",
      args: [
        await this.normalizeAmount(
          amount,
          this._rewardToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  /**
   * Set rewards that can be received per unit time set in the contract
   *
   * @example
   * ```javascript
   * // Set rewards to be 5 tokens per unit time
   * const deposit = await contract.staking721.setRewardsPerUnitTime(5);
   * ```
   *
   * @twfeature Staking721
   */
  setRewardsPerUnitTime = buildTransactionFunction(async (rewards: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setRewardsPerUnitTime",
      args: [
        await this.normalizeAmount(
          rewards,
          this._rewardToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  /**
   * Set time unit for which every reward token is issued.
   *
   * @example
   * ```javascript
   * // Set time unit
   * const setUnits = await contract.staking721.setTimeUnit(60000);
   * ```
   *
   * @twfeature Staking721
   */
  setTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setTimeUnit",
      args: [timeUnit],
    });
  });

  /**
   * Stake given token IDs to the staking contract. NFT transfer approvals are handled automatically.
   *
   * @example
   * ```javascript
   * // Stake token IDs 1 and 2
   * const setUnits = await contract.staking721.stake([1, 2]);
   * ```
   *
   * @twfeature Staking721
   */
  stake = buildTransactionFunction(async (tokenIds: BigNumberish[]) => {
    // Handle approval
    await this.handleNftApproval(
      await this.contractWrapper.getSignerAddress(),
      await this.getAddress(),
      this._stakingToken as ContractWrapper<BaseERC721>,
    );

    // Proceed to call stake function
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "stake",
      args: [tokenIds],
    });
  });

  /**
   * Withdraw specific token IDs from the staking contract
   *
   * @example
   * ```javascript
   * // Withdraw token IDs 1 and 2
   * const setUnits = await contract.staking721.withdraw([1, 2]);
   * ```
   *
   * @twfeature Staking721
   */
  withdraw = buildTransactionFunction(async (tokenIds: BigNumberish[]) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdraw",
      args: [tokenIds],
    });
  });

  /**
   * Withdraw deposited reward tokens
   *
   * @example
   * ```javascript
   * // Withdraw 10 reward tokens
   * const withdraw = await contract.staking721.withdrawRewardTokens(10);
   * ```
   *
   * @twfeature Staking721
   */
  withdrawRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdrawRewardTokens",
      args: [
        await this.normalizeAmount(
          amount,
          this?._rewardToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  // Private functions

  private async getContractWrappers() {
    this._stakingToken = new ContractWrapper<BaseERC721>(
      await this.contractWrapper.getSignerOrProvider(),
      await this.contractWrapper.readContract.stakingToken(),
      ERC721Abi,
      this.contractWrapper.options,
    );
    this._rewardToken = new ContractWrapper<BaseERC20>(
      await this.contractWrapper.getSignerOrProvider(),
      await this.contractWrapper.readContract.rewardToken(),
      ERC20Abi,
      this.contractWrapper.options,
    );
  }
}
