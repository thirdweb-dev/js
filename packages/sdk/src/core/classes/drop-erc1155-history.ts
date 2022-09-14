import { ContractEvents } from "./contract-events";
import type { DropERC1155 } from "@thirdweb-dev/contracts-js";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Manages history for Edition Drop contracts
 * @public
 */
export class DropErc1155History {
  private events;

  constructor(events: ContractEvents<DropERC1155>) {
    this.events = events;
  }

  /**
   * Get all claimer addresses
   *
   * @remarks Get a list of all the addresses that have claimed a token
   * @param tokenId - the tokenId of the NFT to get the addresses of*
   * @returns - A unique list of addresses that claimed the token
   * @example
   * ```javascript
   * const tokenId = "0";
   * const allClaimerAddresses = await contract.history.getAllClaimerAddresses(tokenId);
   * ```
   */
  public async getAllClaimerAddresses(
    tokenId: BigNumberish,
  ): Promise<string[]> {
    const a = (await this.events.getEvents("TokensClaimed")).filter((e) =>
      e.data && BigNumber.isBigNumber(e.data.tokenId)
        ? e.data.tokenId.eq(tokenId)
        : false,
    );

    return Array.from(
      new Set(
        a
          .filter((b) => typeof b.data?.claimer === "string")
          .map((b) => b.data.claimer as string),
      ),
    );
  }
}
