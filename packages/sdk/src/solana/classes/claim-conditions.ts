import { TransactionResult } from "../types/common";
import {
  NFTDropConditionsInput,
  NFTDropConditions,
  NFTDropUpdateableConditionsInputSchema,
} from "../types/contracts/nft-drop";
import { toCurrencyValue } from "../utils/token";
import {
  Amount,
  DateTime,
  Metaplex,
  sol,
  toDateTime,
  token,
} from "@metaplex-foundation/js";
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
  async get(): Promise<NFTDropConditions> {
    const candyMachine = await this.getCandyMachine();
    // TODO add allowlist/hidden settings here
    return {
      price: toCurrencyValue(candyMachine.price),
      currencyAddress: candyMachine.tokenMintAddress?.toBase58() || null,
      primarySaleRecipient: candyMachine.walletAddress.toBase58(),
      sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
      goLiveDate: candyMachine.goLiveDate
        ? new Date(candyMachine.goLiveDate.toNumber() * 1000)
        : null,
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
   *   // The price of each NFT in this drop (in SOL or SPL tokens)
   *   price: 0.1,
   *   // The date for this drop to start
   *   goLiveDate: new Date(),
   *   // ...
   * };
   *
   * const tx = await program.claimConditions.set(claimCondition);
   * ```
   */
  async set(metadata: NFTDropConditionsInput): Promise<TransactionResult> {
    const parsed = NFTDropUpdateableConditionsInputSchema.parse(metadata);

    // recipients
    const wallet: PublicKey | undefined = parsed.primarySaleRecipient
      ? new PublicKey(parsed.primarySaleRecipient)
      : undefined;
    const sellerFeeBasisPoints = parsed.sellerFeeBasisPoints;

    // price
    let price: Amount | undefined = parsed.price
      ? sol(Number(parsed.price))
      : undefined;
    let tokenMint: PublicKey | undefined = undefined;
    if (parsed.currencyAddress && parsed.price) {
      const fetchedToken = await this.metaplex
        .tokens()
        .findMintByAddress({ address: new PublicKey(parsed.currencyAddress) })
        .run();
      price = token(Number(parsed.price), fetchedToken.decimals);
      tokenMint = fetchedToken.address;
    }

    // dates
    const goLiveDate: DateTime | undefined = parsed.goLiveDate
      ? toDateTime(parsed.goLiveDate)
      : undefined;

    // TODO add allowlist/hidden settings here

    const data = {
      ...(wallet && { wallet }),
      ...(tokenMint && { tokenMint }),
      ...(price && { price }),
      ...(goLiveDate && { goLiveDate }),
      ...(sellerFeeBasisPoints && { sellerFeeBasisPoints }),
    };

    const result = await this.metaplex
      .candyMachines()
      .update({
        candyMachine: await this.getCandyMachine(),
        ...data,
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
      .run();
  }
}
