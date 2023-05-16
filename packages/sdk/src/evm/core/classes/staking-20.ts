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
        args: [numerator, denominator],
      });
    },
  );

  setTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setTimeUnit",
      args: [timeUnit],
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

  private async normalizeAmount(
    amount: Amount,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ): Promise<BigNumber> {
    const decimals = await tokenContractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }

  private async handleTokenApproval(
    amount: BigNumberish,
    owner: AddressOrEns,
    spender: AddressOrEns,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ) {
    // Check if already approved
    const allowance = await tokenContractWrapper.readContract.allowance(
      await resolveAddress(owner),
      await resolveAddress(spender),
    );
    if (allowance.gte(amount)) {
      return;
    }
    // Approve token spending
    await tokenContractWrapper.writeContract.approve(
      await resolveAddress(spender),
      amount,
    );
  }
}
