import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_EDITION_STAKE } from "../../constants/thirdweb-features";
import { Address, AddressOrEns } from "../../schema";
import { Currency, CurrencyValue, Amount } from "../../types";
import { BaseERC1155, BaseERC20 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { EditionStake, Staking1155Base } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import { BigNumberish } from "ethers";
import { Staking } from "./staking";

/**
 * Standard ERC1155 Staking functions
 * @remarks Basic functionality for an ERC1155 staking contract.
 * @example
 * ```javascript
 * // stake 3 tokens from token ID 1
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.staking1155.stake(1, 3);
 * ```
 * @public
 */
export class Staking1155<T extends EditionStake | Staking1155Base>
  extends Staking
  implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_EDITION_STAKE.name;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;
  protected _rewardToken: ContractWrapper<BaseERC20> | undefined;
  protected _stakingToken: ContractWrapper<BaseERC1155> | undefined;

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

  ////// Standard Staking1155 Extension //////

  // READ FUNCTIONS

  /**
   * Get the number of reward tokens in the staking contract
   *
   * @remarks Get the number of reward tokens the staking contract owns. To deposit reward tokens, use the `depositRewardTokens` function.
   *
   * @example
   * ```javascript
   * // Get reward token balance for staking contract
   * const balance = await contract.staking1155.getRewardTokenBalance();
   * ```
   *
   * @returns Number of reward tokens, see {@link CurrencyValue}
   * @twfeature Staking1155
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
   * const rewardToken = await contract.staking1155.getRewardToken();
   * ```
   *
   * @returns see {@link Currency}
   * @twfeature Staking1155
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
   * Get default rewards per unit time set in the contract
   *
   * @example
   * ```javascript
   * // Get default rewards
   * const rewards = await contract.staking1155.getDefaultRewardsPerUnitTime();
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking1155
   */
  public async getDefaultRewardsPerUnitTime(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getDefaultRewardsPerUnitTime(),
    );
  }

  /**
   * Get default time unit set in the contract
   *
   * @example
   * ```javascript
   * // Get time unit
   * const units = await contract.staking1155.getDefaultTimeUnit();
   * ```
   *
   * @returns BigNumberish
   * @twfeature Staking1155
   */
  public async getDefaultTimeUnit(): Promise<BigNumberish> {
    return await this.contractWrapper.readContract.getDefaultTimeUnit();
  }

  /**
   * Get rewards per unit time for a specific token ID
   *
   * @example
   * ```javascript
   * // Get rewards per unit time for token ID 1
   * const rewards = await contract.staking1155.getRewardsPerUnitTime(1);
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking1155
   */
  public async getRewardsPerUnitTime(
    tokenId: BigNumberish,
  ): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardsPerUnitTime(tokenId),
    );
  }

  /**
   * Get unclaimed rewards for a specific wallet
   *
   * @example
   * ```javascript
   * // Get unclaimed rewards
   * const rewards = await contract.staking1155.getRewards("thirdweb.eth");
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking1155
   */
  public async getRewards(address: AddressOrEns): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      (
        await this.contractWrapper.readContract.getStakeInfo(
          await resolveAddress(address),
        )
      )[2],
    );
  }

  /**
   * Get all the tokens staked by a specific wallet
   *
   * @example
   * ```javascript
   * // Get tokens staked for token ID 1
   * const tokensStaked = await contract.staking1155.getTokensStaked("thirdweb.eth");
   * ```
   *
   * @twfeature Staking1155
   */
  public async getTokensStaked(
    address: AddressOrEns,
  ): Promise<{ tokenId: BigNumberish; amount: CurrencyValue }[]> {
    const stakeInfo = await this.contractWrapper.readContract.getStakeInfo(
      await resolveAddress(address),
    );
    let tokensStaked: { tokenId: BigNumberish; amount: CurrencyValue }[] = [];
    for (let i = 0; i < stakeInfo[0].length; i++) {
      tokensStaked.push({
        tokenId: stakeInfo[0][i],
        amount: await fetchCurrencyValue(
          await this.contractWrapper.getProvider(),
          (
            await this.getRewardToken()
          ).address,
          stakeInfo[1][i],
        ),
      });
    }
    return tokensStaked;
  }

  /**
   * Get the number of copies staked by token ID and staker
   *
   * @example
   * ```javascript
   * // Get tokens staked for token ID 1
   * const tokensStaked = await contract.staking1155.getTokensStakedByTokenId(1, "thirdweb.eth");
   * ```
   *
   * @returns see {@link CurrencyValue}
   * @twfeature Staking1155
   */
  public async getTokensStakedByTokenId(
    tokenId: BigNumberish,
    staker: AddressOrEns,
  ): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      (
        await this.contractWrapper.readContract.getStakeInfoForToken(
          tokenId,
          await resolveAddress(staker),
        )
      )[0],
    );
  }

  /**
   * Get the time unit set for a specific token ID
   *
   * @example
   * ```javascript
   * // Get time unit for token ID 1
   * const timeUnit = await contract.staking1155.getTimeUnit(1);
   * ```
   *
   * @returns number
   * @twfeature Staking1155
   */
  public async getTimeUnit(tokenId: BigNumberish): Promise<number> {
    return (
      await this.contractWrapper.readContract.getTimeUnit(tokenId)
    ).toNumber();
  }

  /**
   * Get address for the staking token
   *
   * @example
   * ```javascript
   * // Get staking token address
   * const rewardToken = await contract.staking1155.getStakingTokenAddress();
   * ```
   *
   * @returns string
   * @twfeature Staking1155
   */
  public async getStakingTokenAddress(): Promise<string> {
    return await this.contractWrapper.readContract.stakingToken();
  }

  // WRITE FUNCTIONS

  /**
   * Claim rewards and receive reward tokens.
   *
   * @example
   * ```javascript
   * // Claim rewards
   * const claim = await contract.staking1155.claimRewards();
   * ```
   *
   * @twfeature Staking1155
   */
  claimRewards = buildTransactionFunction(async (tokenId: BigNumberish) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [tokenId],
    });
  });

  /**
   * Deposit reward tokens in the staking contract. Automatically fetches and seeks token transfer approval.
   *
   * @example
   * ```javascript
   * // Deposit reward tokens
   * const deposit = await contract.staking1155.depositRewardTokens(500);
   * ```
   *
   * @twfeature Staking1155
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
   * Set default rewards per unit time for token IDs that are not overriden
   *
   * @example
   * ```javascript
   * // Set reward to 100 tokens
   * const rewards = await contract.staking1155.setDefaultRewardsPerUnitTime(100);
   * ```
   *
   * @twfeature Staking1155
   */
  setDefaultRewardsPerUnitTime = buildTransactionFunction(
    async (rewards: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setDefaultRewardsPerUnitTime",
        args: [
          await this.normalizeAmount(
            rewards,
            this._rewardToken as ContractWrapper<BaseERC20>,
          ),
        ],
      });
    },
  );

  /**
   * Set default time unit for all token IDs that are not overriden
   *
   * @example
   * ```javascript
   * // Set default time unit to 60000
   * const units = await contract.staking1155.setDefaultTimeUnit(60000);
   * ```
   *
   * @twfeature Staking1155
   */
  setDefaultTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setDefaultTimeUnit",
      args: [timeUnit],
    });
  });

  /**
   * Set rewards per unit time for a specific token ID
   *
   * @example
   * ```javascript
   * // Set 10 reward tokens per unit time for token ID 1
   * const rewards = await contract.staking1155.setRewardsPerUnitTime(1, 10);
   * ```
   *
   * @twfeature Staking1155
   */
  setRewardsPerUnitTime = buildTransactionFunction(
    async (tokenId: BigNumberish, rewards: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRewardsPerUnitTime",
        args: [
          tokenId,
          await this.normalizeAmount(
            rewards,
            this._rewardToken as ContractWrapper<BaseERC20>,
          ),
        ],
      });
    },
  );

  /**
   * Set time unit for a specific token ID
   *
   * @example
   * ```javascript
   * // Set time unit for token ID 1 to 60000
   * const units = await contract.staking1155.setTimeUnit(1, 60000);
   * ```
   *
   * @twfeature Staking1155
   */
  setTimeUnit = buildTransactionFunction(
    async (tokenId: BigNumberish, timeUnit: number) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setTimeUnit",
        args: [tokenId, timeUnit],
      });
    },
  );

  /**
   * Stake certain amount of copies for a specific token ID
   *
   * @example
   * ```javascript
   * // Stake 10 copies of token ID 1
   * const stake = await contract.staking1155.stake(1, 10);
   * ```
   *
   * @twfeature Staking1155
   */
  stake = buildTransactionFunction(
    async (tokenId: BigNumberish, amount: Amount) => {
      // approval
      await this.handleNftApproval(
        await this.contractWrapper.getSignerAddress(),
        await this.getAddress(),
        this._stakingToken as ContractWrapper<BaseERC1155>,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "stake",
        args: [
          tokenId,
          await this.normalizeAmount(
            amount,
            this._rewardToken as ContractWrapper<BaseERC20>,
          ),
        ],
      });
    },
  );

  /**
   * Withdraw specific token ID and their amount
   *
   * @example
   * ```javascript
   * // Withdraw 10 copies of token ID 1
   * const withdraw = await contract.staking1155.withdraw(1, 10);
   * ```
   *
   * @twfeature Staking1155
   */
  withdraw = buildTransactionFunction(
    async (tokenId: BigNumberish, amount: Amount) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "withdraw",
        args: [
          tokenId,
          await this.normalizeAmount(
            amount,
            this._rewardToken as ContractWrapper<BaseERC20>,
          ),
        ],
      });
    },
  );

  /**
   * Withdraw deposited reward tokens
   *
   * @example
   * ```javascript
   * // Withdraw 10 reward tokens
   * const withdraw = await contract.staking1155.withdrawRewardTokens(10);
   * ```
   *
   * @twfeature Staking1155
   */
  withdrawRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdrawRewardTokens",
      args: [
        await this.normalizeAmount(
          amount,
          this._rewardToken as ContractWrapper<BaseERC20>,
        ),
      ],
    });
  });

  // Private functions

  private async getContractWrappers() {
    this._stakingToken = new ContractWrapper<BaseERC1155>(
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
