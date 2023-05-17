import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_TOKEN_STAKE } from "../../constants/thirdweb-features";
import { Address, AddressOrEns } from "../../schema";
import { Currency, CurrencyValue, Amount } from "../../types";
import { BaseERC20 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { TokenStake, Staking20Base } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { AmountSchema } from "../../../core/schema/shared";
import { Staking } from "./staking";

/**
 * Standard ERC20 Token functions
 * @remarks Basic functionality for a ERC20 contract that handles all unit transformation for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc20.transfer(walletAddress, amount);
 * ```
 * @public
 */
export class Staking20<T extends TokenStake | Staking20Base>
  extends Staking
  implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_TOKEN_STAKE.name;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;
  protected _stakingToken: ContractWrapper<BaseERC20> | undefined;
  protected _rewardToken: ContractWrapper<BaseERC20> | undefined;

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

  ////// Standard Staking20 Extension //////

  ////// READ FUNCTIONS //////

  /**
   * Get the number of reward tokens in the staking contract
   *
   * @remarks Get the number of reward tokens the staking contract owns. To deposit reward tokens, use the `depositRewardTokens` function.
   *
   * @example
   * ```javascript
   * // Get reward token balance for staking contract
   * const balance = await contract.staking20.getRewardTokenBalance();
   * ```
   *
   * @returns Number of reward tokens, see {@link CurrencyValue}
   * @twfeature Staking20
   */
  public async getRewardTokenBalance(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardTokenBalance(),
    );
  }

  /**
   * Get the time unit for new reward tokens set in the staking contract.
   *
   * @remarks Get the time unit after which new rewards are issued.
   *
   * @example
   * ```javascript
   * // Get time unit for staking contract
   * const timeUnit = await contract.staking20.getTimeUnit();
   * ```
   *
   * @returns number
   * @twfeature Staking20
   */
  public async getTimeUnit(): Promise<number> {
    return (await this.contractWrapper.readContract.getTimeUnit()).toNumber();
  }

  /**
   * Get the tokens staked by a particular address
   *
   * @example
   * ```javascript
   * // Get tokens staked by address or ENS
   * const timeUnit = await contract.staking20.getTokensStaked("thirdweb.eth");
   * ```
   *
   * @returns Number of tokens staked, see {@link CurrencyValue}
   * @twfeature Staking20
   */
  public async getTokensStaked(address: AddressOrEns): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getStakingToken()).address,
      (
        await this.contractWrapper.readContract.getStakeInfo(
          await resolveAddress(address),
        )
      )[0],
    );
  }

  /**
   * Get the unclaimed rewards for a particular wallet address or ENS.
   *
   * @example
   * ```javascript
   * // Get unclaimed rewards
   * const unclaimedRewards = await contract.staking20.getRewards("thirdweb.eth");
   * ```
   *
   * @returns Number of unclaimed reward tokens, see {@link CurrencyValue}
   * @twfeature Staking20
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

  // TODO: Create a type

  /**
   * Get the time unit for new reward tokens set in the staking contract.
   *
   * @example
   * ```javascript
   * // Get time unit for staking contract
   * const rewardRatio = await contract.staking20.getRewardRatio();
   * ```
   *
   * @returns Reward ratio numerator and denominator
   * ```javascript
   * {
   *    numerator: 1,
   *    denominator: 2
   * }
   * ```
   *
   * @twfeature Staking20
   */
  public async getRewardRatio(): Promise<{
    numerator: number;
    denominator: number;
  }> {
    return {
      numerator: (
        await this.contractWrapper.readContract.getRewardRatio()
      )[0].toNumber(),
      denominator: (
        await this.contractWrapper.readContract.getRewardRatio()
      )[1].toNumber(),
    };
  }

  // TODO: Create types

  /**
   * Get information about staking token
   *
   * @example
   * ```javascript
   * // Get staking token info
   * const stakingToken = await contract.staking20.getStakingToken();
   * ```
   *
   * @returns see {@link Currency}
   * @twfeature Staking20
   */
  public async getStakingToken(): Promise<Currency & { address: string }> {
    return {
      ...(await fetchCurrencyMetadata(
        await this.contractWrapper.getProvider(),
        await this.contractWrapper.readContract.stakingToken(),
      )),
      address: await this.contractWrapper.readContract.stakingToken(),
    };
  }

  // TODO: Create types

  /**
   * Get information about reward token
   *
   * @example
   * ```javascript
   * // Get reward token info
   * const rewardToken = await contract.staking20.getRewardToken();
   * ```
   *
   * @returns see {@link Currency}
   * @twfeature Staking20
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

  ////// WRITE FUNCTIONS //////

  /**
   * Stake tokens in the staking contract. Automatically fetches and seeks token transfer approval.
   *
   * @example
   * ```javascript
   * // Stake 10 tokens
   * const stake = await contract.staking20.stake(10);
   * ```
   *
   * @twfeature Staking20
   */
  stake = buildTransactionFunction(async (amount: Amount) => {
    // Approve tokens on staking contract
    await this.handleTokenApproval(
      await this.normalizeAmount(
        amount,
        this._stakingToken as ContractWrapper<BaseERC20>,
      ),
      await this.contractWrapper.getSignerAddress(),
      this.getAddress(),
      this._stakingToken as ContractWrapper<BaseERC20>,
    );

    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "stake",
      args: [
        await this.normalizeAmount(
          amount,
          this._stakingToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  /**
   * Withdraw staking tokens from the contract.
   *
   * @example
   * ```javascript
   * // Withdraw 10 tokens
   * const withdraw = await contract.staking20.withdraw(10);
   * ```
   *
   * @twfeature Staking20
   */
  withdraw = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdraw",
      // TODO: Update to check decimals as well
      args: [
        await this.normalizeAmount(
          amount,
          this._stakingToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  /**
   * Withdraw deposited reward tokens
   *
   * @example
   * ```javascript
   * // Withdraw 10 reward tokens
   * const withdraw = await contract.staking20.withdrawRewardTokens(10);
   * ```
   *
   * @twfeature Staking20
   */
  withdrawRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdrawRewardTokens",
      // TODO: Update to check decimals as well
      args: [
        await this.normalizeAmount(
          amount,
          this?._rewardToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  /**
   * Claim rewards and receive reward tokens.
   *
   * @example
   * ```javascript
   * // Claim rewards
   * const claim = await contract.staking20.claimRewards();
   * ```
   *
   * @twfeature Staking20
   */
  claimRewards = buildTransactionFunction(async () => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [],
    });
  });

  /**
   * Set reward ratio for the staking contract.
   *
   * @param numerator - numerator for the reward ratio
   * @param denominator - denominator for the reward ratio
   *
   * @example
   * ```javascript
   * // Set reward ratio
   * const setRatio = await contract.staking20.setRewardRatio(1, 2);
   * ```
   *
   * @twfeature Staking20
   */
  setRewardRatio = buildTransactionFunction(
    async (numerator: number, denominator: number) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRewardRatio",
        args: [numerator, denominator],
      });
    },
  );

  /**
   * Set time unit for which every reward token is issued.
   *
   * @example
   * ```javascript
   * // Set time unit
   * const setUnits = await contract.staking20.setTimeUnit(60000);
   * ```
   *
   * @twfeature Staking20
   */
  setTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setTimeUnit",
      args: [timeUnit],
    });
  });

  /**
   * Deposit reward tokens in the staking contract. Automatically fetches and seeks token transfer approval.
   *
   * @example
   * ```javascript
   * // Deposit reward tokens
   * const deposit = await contract.staking20.depositRewardTokens(500);
   * ```
   *
   * @twfeature Staking20
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

  // PRIVATE
  private async getContractWrappers() {
    this._stakingToken = new ContractWrapper<BaseERC20>(
      await this.contractWrapper.getSignerOrProvider(),
      await this.contractWrapper.readContract.stakingToken(),
      ERC20Abi,
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
