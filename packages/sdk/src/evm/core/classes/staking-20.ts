import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
  toWei,
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
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this._chainId = chainId;

    this.getStakingAndRewardTokens();
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
  public async getRewardTokenBalance(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardTokenBalance(),
    );
  }

  public async getTimeUnit(): Promise<number> {
    return (await this.contractWrapper.readContract.getTimeUnit()).toNumber();
  }

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
  public async getStakingToken(): Promise<Currency & { address: string }> {
    return {
      ...(await fetchCurrencyMetadata(
        await this.contractWrapper.getProvider(),
        await this.contractWrapper.readContract.stakingToken(),
      )),
      address: await this.contractWrapper.readContract.stakingToken(),
    };
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

  ////// WRITE FUNCTIONS //////
  stake = buildTransactionFunction(async (amount: Amount) => {
    // Should add automatic token transfer approval? probably yes a private function
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "stake",
      // TODO: Update to check decimals as well
      args: [toWei(amount)],
    });
  });

  withdraw = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdraw",
      // TODO: Update to check decimals as well
      args: [toWei(amount)],
    });
  });

  withdrawRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "withdrawRewardTokens",
      // TODO: Update to check decimals as well
      args: [toWei(amount)],
    });
  });

  claimRewards = buildTransactionFunction(async () => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [],
    });
  });

  setRewardRatio = buildTransactionFunction(
    async (numerator: number, denominator: number) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setRewardRatio",
        // TODO: Update to check decimals as well
        args: [numerator, denominator],
      });
    },
  );

  setTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setTimeUnit",
      // TODO: Update to check decimals as well
      args: [timeUnit],
    });
  });

  depositRewardTokens = buildTransactionFunction(async (amount: Amount) => {
    // TODO: Perform approval for reward tokens
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "depositRewardTokens",
      // TODO: Update to check decimals as well
      args: [amount],
    });
  });

  // PRIVATE
  private async getStakingAndRewardTokens() {
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
