import { NetworkOrSignerOrProvider, TransactionResultWithId } from "..";
import { fetchCurrencyMetadata } from "../../common";
import { LINK_TOKEN_ADDRESS } from "../../constants";
import { PackRewards, SDKOptions } from "../../schema";
import { Amount, CurrencyValue } from "../../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20 } from "./erc-20";
import type { ERC20 } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/ERC20.json";
import IPackAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect.json";
import type {
  IPackVRFDirect,
  PackOpenedEvent,
  PackOpenRequestedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/IPackVRFDirect";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers } from "ethers";

export class PackVRF {
  private contractWrapper: ContractWrapper<IPackVRFDirect>;
  private storage: ThirdwebStorage;
  private chainId: number;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions,
    chainId: number,
    contractWrapper: ContractWrapper<IPackVRFDirect> = new ContractWrapper(
      network,
      address,
      IPackAbi,
      options,
    ),
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.chainId = chainId;
  }

  /**
   * Open a pack using Chainlink VRFs random number generation
   * This will return a transaction result with the requestId of the open request, NOT the contents of the pack
   * To get the contents of the pack, you must call claimRewards once the VRF request has been fulfilled
   * You can use the canClaimRewards method to check if the VRF request has been fulfilled
   * @param tokenId
   * @param amount
   * @returns
   */
  public async open(
    tokenId: BigNumberish,
    amount: BigNumberish = 1,
  ): Promise<TransactionResultWithId> {
    const receipt = await this.contractWrapper.sendTransaction(
      "openPack",
      [tokenId, amount],
      {
        // Higher gas limit for opening packs
        gasLimit: 500000,
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
   * Claim the rewards from a pack that has been opened
   * This will return the contents of the pack
   * Make sure to check if the VRF request has been fulfilled using canClaimRewards() before calling this method
   * @returns the random rewards from opening a pack
   */
  public async claimRewards(): Promise<PackRewards> {
    const receipt = await this.contractWrapper.sendTransaction(
      "claimRewards",
      [],
      {
        // Higher gas limit for opening packs
        gasLimit: 500000,
      },
    );
    const event = this.contractWrapper.parseLogs<PackOpenedEvent>(
      "PackOpened",
      receipt?.logs,
    );
    if (event.length === 0) {
      throw new Error("PackOpened event not found");
    }
    const rewards = event[0].args.rewardUnitsDistributed;

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
            quantityPerReward: ethers.utils
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
   * Check if the connected address can claim rewards after opening a pack
   * @param claimerAddress Optional: the address to check if they can claim rewards, defaults to the connected address
   * @returns whether the connected address can claim rewards after opening a pack
   */
  public async canClaimRewards(claimerAddress?: string): Promise<boolean> {
    const address =
      claimerAddress || (await this.contractWrapper.getSignerAddress());
    return await this.contractWrapper.readContract.canClaimRewards(address);
  }

  /**
   * Open a pack and claim the rewards sequentially. This will prompt 2 transactions to the user.
   * This function will wait till the VRF request has been fulfilled before claiming the rewards
   * This function will throw an error if the VRF request has not been fulfilled after 2 minutes
   * @param tokenId
   * @param amount
   * @returns
   */
  public async openAndClaim(tokenId: BigNumberish, amount: BigNumberish = 1) {
    await this.open(tokenId, amount);
    // poll until canClaimRewards is true (takes ~3 blocks)
    let canClaim = false;
    let retries = 0;
    while (!canClaim) {
      if (retries > 60) {
        throw new Error("VRF request not fulfilled after 2 minutes");
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      canClaim = await this.canClaimRewards();
      retries++;
    }
    return await this.claimRewards();
  }

  /**
   * Get the balance of LINK in the contract
   * @returns the balance of LINK in the contract
   */
  public async getLinkBalance(): Promise<CurrencyValue> {
    return this.getLinkContract().balanceOf(
      this.contractWrapper.readContract.address,
    );
  }

  /**
   * Transfer LINK to this contract
   * @param amount the amount of LINK to transfer to the contract
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
    const contract = new ContractWrapper<ERC20>(
      this.contractWrapper.getSignerOrProvider(),
      linkAddress,
      ERC20Abi,
      this.contractWrapper.options,
    );
    return new Erc20(contract, this.storage, this.chainId);
  }
}
