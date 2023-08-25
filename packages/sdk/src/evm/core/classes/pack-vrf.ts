import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { LINK_TOKEN_ADDRESS } from "../../constants/currency";
import { FEATURE_PACK_VRF } from "../../constants/thirdweb-features";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { Address } from "../../schema/shared/Address";
import { SDKOptions } from "../../schema/sdk-options";
import { PackRewards } from "../../schema/tokens/pack";
import type { Amount, CurrencyValue } from "../../types/currency";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20 } from "./erc-20";
import type { ERC20Base, PackVRFDirect } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import IPackAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect.json";
import {
  ITokenBundle,
  PackOpenedEvent,
  PackOpenedEventObject,
  PackOpenRequestedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/IPackVRFDirect";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, type BigNumberish, utils } from "ethers";
import type { NetworkInput, TransactionResultWithId } from "../types";
import { ContractEvents } from "./contract-events";
import { Transaction } from "./transactions";

export class PackVRF implements UpdateableNetwork, DetectableFeature {
  featureName = FEATURE_PACK_VRF.name;
  private contractWrapper: ContractWrapper<PackVRFDirect>;
  private storage: ThirdwebStorage;
  public chainId: number;
  private events: ContractEvents<PackVRFDirect>;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions,
    chainId: number,
    contractWrapper: ContractWrapper<PackVRFDirect> = new ContractWrapper(
      network,
      address,
      IPackAbi,
      options,
      storage,
    ),
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.chainId = chainId;
    this.events = new ContractEvents(this.contractWrapper);
  }

  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  /**
   * Open pack
   *
   * @example
   * ```javascript
   * const tokenId = 0;
   * const amount = 1;
   * const receipt = await contract.pack.open(tokenId, amount);
   * ```
   *
   * @remarks Open a pack using Chainlink VRFs random number generation
   * @remarks This will return a transaction result with the requestId of the open request, NOT the contents of the pack
   * @remarks To get the contents of the pack, you must call claimRewards once the VRF request has been fulfilled
   * @remarks You can use the canClaimRewards method to check if the VRF request has been fulfilled
   * @param tokenId
   * @param amount
   * @returns
   * @twfeature PackVRF
   */
  open = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      amount: BigNumberish = 1,
      gasLimit = 500000,
    ): Promise<Transaction<TransactionResultWithId>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "openPack",
        args: [tokenId, amount],
        overrides: {
          // Higher gas limit for opening packs
          gasLimit,
        },
        parse: (receipt) => {
          let id = BigNumber.from(0);
          try {
            const event =
              this.contractWrapper.parseLogs<PackOpenRequestedEvent>(
                "PackOpenRequested",
                receipt?.logs,
              );
            id = event[0].args.requestId;
          } catch (e) {}

          return {
            receipt,
            id,
          };
        },
      });
    },
  );

  /**
   * Claim the rewards from an opened pack
   *
   * @example
   * ```javascript
   * const rewards = await contract.pack.claimRewards();
   * ```
   *
   * @remarks This will return the contents of the pack
   * @remarks Make sure to check if the VRF request has been fulfilled using canClaimRewards() before calling this method
   * @returns the random rewards from opening a pack
   * @twfeature PackVRF
   */
  claimRewards = /* @__PURE__ */ buildTransactionFunction(
    async (gasLimit = 500000): Promise<Transaction<Promise<PackRewards>>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "claimRewards",
        args: [],
        overrides: {
          // Higher gas limit for opening packs
          gasLimit,
        },
        parse: async (receipt) => {
          const event = this.contractWrapper.parseLogs<PackOpenedEvent>(
            "PackOpened",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("PackOpened event not found");
          }
          const rewards = event[0].args.rewardUnitsDistributed;

          return await this.parseRewards(rewards);
        },
      });
    },
  );

  private async parseRewards(
    rewards: ITokenBundle.TokenStructOutput[],
  ): Promise<PackRewards> {
    const erc20Rewards: PackRewards["erc20Rewards"] = [];
    const erc721Rewards: PackRewards["erc721Rewards"] = [];
    const erc1155Rewards: PackRewards["erc1155Rewards"] = [];

    for (const reward of rewards) {
      switch (reward.tokenType) {
        case 0: {
          const tokenMetadata = await fetchCurrencyMetadata(
            this.contractWrapper.getProvider(),
            reward.assetContract,
          );
          erc20Rewards.push({
            contractAddress: reward.assetContract,
            quantityPerReward: utils
              .formatUnits(reward.totalAmount, tokenMetadata.decimals)
              .toString(),
          });
          break;
        }
        case 1: {
          erc721Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
          });
          break;
        }
        case 2: {
          erc1155Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
            quantityPerReward: reward.totalAmount.toString(),
          });
          break;
        }
      }
    }

    return {
      erc20Rewards,
      erc721Rewards,
      erc1155Rewards,
    };
  }

  /**
   * Setup a listener for when a pack is opened
   *
   * @example
   * ```javascript
   * const unsubscribe = await contract.pack.addPackOpenEventListener((packId, openerAddress, rewards) => {
   *  console.log(`Pack ${packId} was opened by ${openerAddress} and contained:`, rewards);
   * });
   * @param callback the listener to call when a pack is opened
   * @returns a unsubscribe function to cleanup the listener
   * @twfeature PackVRF
   */
  public async addPackOpenEventListener(
    callback: (
      packId: string,
      openerAddress: Address,
      rewards: PackRewards,
    ) => void,
  ) {
    return this.events.addEventListener<PackOpenedEventObject>(
      "PackOpened",
      async (event) => {
        callback(
          event.data.packId.toString(),
          event.data.opener,
          await this.parseRewards(event.data.rewardUnitsDistributed),
        );
      },
    );
  }

  /**
   * Check if a specific wallet can claim rewards after opening a pack
   *
   * @example
   * ```javascript
   * const canClaim = await contract.pack.canClaimRewards("{{wallet_address}}");
   * ```
   * @param claimerAddress Optional: the address to check if they can claim rewards, defaults to the connected address
   * @returns whether the connected address can claim rewards after opening a pack
   * @twfeature PackVRF
   */
  public async canClaimRewards(
    claimerAddress?: AddressOrEns,
  ): Promise<boolean> {
    const address = await resolveAddress(
      claimerAddress || (await this.contractWrapper.getSignerAddress()),
    );
    return await this.contractWrapper.readContract.canClaimRewards(address);
  }

  /**
   * Open a pack and claim the rewards
   * @remarks This function will only start the flow of opening a pack, the rewards will be granted automatically to the connected address after VRF request is fulfilled
   *
   * @example
   * ```javascript
   * const packId = 0;
   * const amount = 1;
   * const { id } = await contract.pack.openAndClaim(packId, amount);
   * ```
   *
   * @param packId The id of the pack to open
   * @param amount Optional: the amount of packs to open, defaults to 1
   * @param gasLimit Optional: the gas limit to use for the VRF callback transaction, defaults to 500000
   * @returns
   * @twfeature PackVRF
   */
  public async openAndClaim(
    packId: BigNumberish,
    amount: BigNumberish = 1,
    gasLimit: BigNumberish = 500000,
  ): Promise<TransactionResultWithId> {
    const receipt = await this.contractWrapper.sendTransaction(
      "openPackAndClaimRewards",
      [packId, amount, gasLimit],
      {
        // Higher gas limit for opening packs
        gasLimit: BigNumber.from(500000),
      },
    );
    let id = BigNumber.from(0);
    try {
      const event = this.contractWrapper.parseLogs<PackOpenRequestedEvent>(
        "PackOpenRequested",
        receipt?.logs,
      );
      id = event[0].args.requestId;
    } catch (e) {}

    return {
      receipt,
      id,
    };
  }

  /**
   * Get the LINK balance of the contract
   *
   * @example
   * ```javascript
   * const balance = await contract.pack.getLinkBalance();
   * ```
   *
   * @returns the balance of LINK in the contract
   * @twfeature PackVRF
   */
  public async getLinkBalance(): Promise<CurrencyValue> {
    return this.getLinkContract().balanceOf(
      this.contractWrapper.readContract.address,
    );
  }

  /**
   * Transfer LINK to this contract
   *
   * @example
   * ```javascript
   * const amount = 1;
   * await contract.pack.transferLink(amount);
   * ```
   *
   * @param amount the amount of LINK to transfer to the contract
   * @twfeature PackVRF
   */
  public async transferLink(amount: Amount) {
    await this.getLinkContract().transfer(
      this.contractWrapper.readContract.address,
      amount,
    );
  }

  private getLinkContract(): Erc20 {
    const linkAddress = LINK_TOKEN_ADDRESS[this.chainId];
    if (!linkAddress) {
      throw new Error(
        `No LINK token address found for chainId ${this.chainId}`,
      );
    }
    const contract = new ContractWrapper<ERC20Base>(
      this.contractWrapper.getSignerOrProvider(),
      linkAddress,
      ERC20Abi,
      this.contractWrapper.options,
      this.storage,
    );
    return new Erc20(contract, this.storage, this.chainId);
  }
}
