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

  public async getDefaultRewardsPerUnitTime(): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getDefaultRewardsPerUnitTime(),
    );
  }

  public async getDefaultTimeUnit(): Promise<BigNumberish> {
    return await this.contractWrapper.readContract.getDefaultTimeUnit();
  }

  public async getRewardsPerUnitTime(
    tokenId: BigNumberish,
  ): Promise<CurrencyValue> {
    return fetchCurrencyValue(
      await this.contractWrapper.getProvider(),
      (await this.getRewardToken()).address,
      await this.contractWrapper.readContract.getRewardsPerUnitTime(tokenId),
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
      )[2],
    );
  }

  // ?
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

  public async getTimeUnit(tokenId: BigNumberish): Promise<number> {
    return (
      await this.contractWrapper.readContract.getTimeUnit(tokenId)
    ).toNumber();
  }

  public async getStakingTokenAddress(): Promise<string> {
    return await this.contractWrapper.readContract.stakingToken();
  }

  // WRITE FUNCTIONS
  claimRewards = buildTransactionFunction(async (tokenId: BigNumberish) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claimRewards",
      args: [tokenId],
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

  setDefaultTimeUnit = buildTransactionFunction(async (timeUnit: number) => {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "setDefaultTimeUnit",
      args: [timeUnit],
    });
  });

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

  setTimeUnit = buildTransactionFunction(
    async (tokenId: BigNumberish, timeUnit: number) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setTimeUnit",
        args: [tokenId, timeUnit],
      });
    },
  );

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
