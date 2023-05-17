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
  public async getRewardTokenBalance(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardTokenBalance(),
    );
  }

  public async getRewardToken(): Promise<Currency & { address: string }> {
    return {
      ...(await fetchCurrencyMetadata(
        await this.contractWrapper.getProvider(),
        await this.contractWrapper.readContract.rewardToken(),
      )),
      address: await this.contractWrapper.readContract.rewardToken(),
    };
  }

  public async getStakingTokenAddress(): Promise<string> {
    return await this.contractWrapper.readContract.stakingToken();
  }

  public async getRewardsPerUnitTime(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardsPerUnitTime(),
    );
  }

  // array of token ids staked
  public async getTokensStaked(staker: AddressOrEns): Promise<BigNumberish[]> {
    return (await this.contractWrapper.readContract.getStakeInfo(staker))[0];
  }

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

  public async getTimeUnit(): Promise<number> {
    return (await this.contractWrapper.readContract.getTimeUnit()).toNumber();
  }

  // WRITE FUNCTIONS

  claimRewards = buildTransactionFunction(async () => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [],
    });
  });

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

  setTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setTimeUnit",
      args: [timeUnit],
    });
  });

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

  withdraw = buildTransactionFunction(async (tokenIds: BigNumberish[]) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdraw",
      args: [tokenIds],
    });
  });

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
