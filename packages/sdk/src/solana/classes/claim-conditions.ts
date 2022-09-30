import { TransactionResult } from "../types/common";
import {
  NFTDropConditionsOutputSchema,
  NFTDropMetadataInput,
} from "../types/contracts/nft-drop";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

/**
 * Set the claim conditions for your NFT Drop to control how people can claim NFTs
 *
 * @example
 * ```jsx
 * const program = await sdk.getNFTDrop("{{contract_address}}");
 *
 * // Get the data of the claim condition on the drop
 * const claimCondition = await program.claimConditions.get();
 * // View the price of the drop
 * console.log(claimCondition.price);
 * // View the date when the drop will go live
 * console.log(claimCondition.goLiveDate);
 * ```
 *
 * @public
 */
export class ClaimConditions {
  private dropMintAddress: PublicKey;
  private metaplex: Metaplex;

  constructor(dropAddress: string, metaplex: Metaplex) {
    this.dropMintAddress = new PublicKey(dropAddress);
    this.metaplex = metaplex;
  }

  /**
   * Get the claim condition for this contract
   * @returns - The claim condition data for this NFT Drop
   *
   * @example
   * ```jsx
   * // Get the data of the claim condition on the drop
   * const claimCondition = await program.claimConditions.get();
   * // View the price of the drop
   * console.log(claimCondition.price);
   * // View the date when the drop will go live
   * console.log(claimCondition.goLiveDate);
   * ```
   */
  async get(): Promise<NFTDropMetadataInput> {
    const candyMachine = await this.getCandyMachine();

    return {
      price: candyMachine.price.basisPoints.toNumber(),
      sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
      itemsAvailable: candyMachine.itemsAvailable.toNumber(),
      goLiveDate: candyMachine.goLiveDate
        ? new Date(candyMachine.goLiveDate.toNumber() * 1000)
        : undefined,
    };
  }

  /**
   * Set the claim condition settings to configure how people can claim your NFT Drop
   * @param metadata - The settings to use for the claim condition of this program
   * @returns - The transaction result of setting the claim condition
   *
   * @example
   * ```jsx
   * // Specify the settings for your claim condition
   * const claimCondition = {
   *   // The price of each NFT in this drop
   *   price: 0,
   *   // The date for this drop to start
   *   goLiveDate: new Date(),
   *   // ...
   * };
   *
   * const tx = await program.claimConditions.set(claimCondition);
   * ```
   */
  async set(metadata: NFTDropMetadataInput): Promise<TransactionResult> {
    const parsed = NFTDropConditionsOutputSchema.parse(metadata);

    const result = await this.metaplex
      .candyMachines()
      .update({
        candyMachine: await this.getCandyMachine(),
        ...parsed,
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  private async getCandyMachine() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.dropMintAddress })
      .run(); // TODO abstract return types away
  }
}
