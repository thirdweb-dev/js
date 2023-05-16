import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_NFT_STAKE,
  FEATURE_TOKEN_STAKE,
} from "../../constants/thirdweb-features";
import { Address, AddressOrEns } from "../../schema";
import { Currency, CurrencyValue, Amount } from "../../types";
import { BaseERC20, BaseERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  TokenStake,
  Staking20Base,
  NFTStake,
  Staking721Base,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
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
export class Staking721<T extends NFTStake | Staking721Base>
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

  private async handleNftApproval(
    owner: AddressOrEns,
    operator: AddressOrEns,
    tokenContractWrapper: ContractWrapper<BaseERC721>,
  ) {
    const isApproved = await tokenContractWrapper.readContract.isApprovedForAll(
      await resolveAddress(owner),
      await resolveAddress(operator),
    );
    if (isApproved) {
      return;
    }
    // Approve NFT operator
    await tokenContractWrapper.writeContract.setApprovalForAll(
      await resolveAddress(operator),
      true,
    );
  }

  private async normalizeAmount(
    amount: Amount,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ): Promise<BigNumber> {
    const decimals = await tokenContractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }
}
