import { NetworkOrSignerOrProvider, TransactionResultWithId } from "..";
import { fetchCurrencyMetadata } from "../../common";
import { PackRewards, SDKOptions } from "../../schema";
import { ContractWrapper } from "./contract-wrapper";
import IPackAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect.json";
import type {
  IPackVRFDirect,
  PackOpenedEvent,
  PackOpenRequestedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/IPackVRFDirect";
import { BigNumber, BigNumberish, ethers } from "ethers";

export class PackVRF {
  private contractWrapper: ContractWrapper<IPackVRFDirect>;
  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    options: SDKOptions,
    contractWrapper: ContractWrapper<IPackVRFDirect> = new ContractWrapper(
      network,
      address,
      IPackAbi,
      options,
    ),
  ) {
    this.contractWrapper = contractWrapper;
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
      claimerAddress ?? (await this.contractWrapper.getSignerAddress());
    return await this.contractWrapper.readContract.canClaimRewards(address);
  }

  /**
   * Open a pack and claim the rewards sequentially. This will prompt 2 transactions to the user.
   * This function will wait till the VRF request has been fulfilled before claiming the rewards
   * @param tokenId
   * @param amount
   * @returns
   */
  public async openAndClaim(tokenId: BigNumberish, amount: BigNumberish = 1) {
    await this.open(tokenId, amount);
    await this.delay(5000); // wait 5 secs
    // poll until canClaimRewards is true (takes 3 blocks)
    while (!(await this.canClaimRewards())) {
      await this.delay(5000); // try every 5 secs
    }
    return await this.claimRewards();
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
