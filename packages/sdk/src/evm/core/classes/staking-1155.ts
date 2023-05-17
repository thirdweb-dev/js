import { NetworkInput } from "..";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { resolveAddress } from "../../common/ens";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_EDITION_STAKE,
  FEATURE_NFT_STAKE,
  FEATURE_TOKEN_STAKE,
} from "../../constants/thirdweb-features";
import { Address, AddressOrEns } from "../../schema";
import { Currency, CurrencyValue, Amount } from "../../types";
import { BaseERC1155, BaseERC20, BaseERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  TokenStake,
  Staking20Base,
  NFTStake,
  Staking721Base,
  EditionStake,
  Staking1155Base,
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
export class Staking1155<T extends EditionStake | Staking1155Base>
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

  private async handleNftApproval(
    owner: AddressOrEns,
    operator: AddressOrEns,
    tokenContractWrapper: ContractWrapper<BaseERC1155>,
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

  private async normalizeAmount(
    amount: Amount,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ): Promise<BigNumber> {
    const decimals = await tokenContractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }
}
