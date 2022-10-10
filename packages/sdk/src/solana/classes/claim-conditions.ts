import { TransactionResult } from "../types/common";
import {
  NFTDropConditionsInput,
  NFTDropConditions,
  NFTDropUpdateableConditionsInputSchema,
} from "../types/programs/nft-drop";
import { toCurrencyValue } from "../utils/token";
import {
  Amount,
  CandyMachineEndSettings,
  DateTime,
  Metaplex,
  sol,
  toBigNumber,
  toDateTime,
  token,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

/**
 * Set the claim conditions for your NFT Drop to control how people can claim NFTs
 *
 * @example
 * ```jsx
 * const program = await sdk.getProgram("{{program_address}}", "nft-drop");
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
    const totalAvailableSupply = candyMachine.itemsAvailable.toNumber();
    const lazyMintedSupply = candyMachine.itemsLoaded.toNumber();
    const goLiveDate = candyMachine.goLiveDate
      ? new Date(candyMachine.goLiveDate.toNumber() * 1000)
      : null;
    const isWithinGoLiveDate = candyMachine.goLiveDate
      ? candyMachine.goLiveDate.toNumber() * 1000 >= Date.now()
      : true;
    const maxClaimable =
      candyMachine.endSettings && candyMachine.endSettings.endSettingType === 1
        ? candyMachine.endSettings.number.toNumber()
        : "unlimited";

    const claimedSupply = candyMachine.itemsMinted.toNumber();
    const isBelowMaxClaimable =
      maxClaimable !== "unlimited"
        ? claimedSupply < maxClaimable
        : claimedSupply < lazyMintedSupply;

    // TODO add allowlist/hidden settings here
    return {
      price: toCurrencyValue(candyMachine.price),
      currencyAddress: candyMachine.tokenMintAddress?.toBase58() || null,
      primarySaleRecipient: candyMachine.walletAddress.toBase58(),
      sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
      startTime: goLiveDate,
      totalAvailableSupply,
      lazyMintedSupply,
      claimedSupply,
      maxClaimable: maxClaimable.toString(),
      isReadyToClaim:
        candyMachine.isFullyLoaded && isWithinGoLiveDate && isBelowMaxClaimable,
    };
  }

  async assertCanClaimable(quantity: number) {
    const conditions = await this.get();
    if (!conditions.isReadyToClaim) {
      if (conditions.lazyMintedSupply < conditions.totalAvailableSupply) {
        throw new Error(
          `NFT Drop is not fully loaded yet. Only ${conditions.lazyMintedSupply} out of ${conditions.totalAvailableSupply} NFTs have been lazy minted.`,
        );
      }
      if (conditions.maxClaimable === "0") {
        throw new Error(
          `Max Claimable is 0. No NFTs can be claimed. Set your claim conditions to enable claiming.`,
        );
      }
      const maxClaimable =
        conditions.maxClaimable === "unlimited"
          ? null
          : parseInt(conditions.maxClaimable);
      if (
        (maxClaimable !== null &&
          conditions.claimedSupply + quantity > maxClaimable) ||
        conditions.claimedSupply + quantity > conditions.lazyMintedSupply
      ) {
        throw new Error(
          `Max claimable reached - ${conditions.claimedSupply} out of ${
            conditions.maxClaimable !== null
              ? conditions.maxClaimable
              : conditions.lazyMintedSupply
          } NFTs have been claimed.`,
        );
      }
      if (conditions.startTime && conditions.startTime > new Date()) {
        throw new Error(
          `Drop is not to ready be claimed yet, start date is ${conditions.startTime}`,
        );
      }
    }
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
    const goLiveDate: DateTime | undefined = parsed.startTime
      ? toDateTime(parsed.startTime)
      : undefined;

    // max claimable
    const endSettings: CandyMachineEndSettings | null | undefined =
      parsed.maxClaimable
        ? parsed.maxClaimable === "unlimited"
          ? null
          : {
              endSettingType: 1,
              number: toBigNumber(parsed.maxClaimable),
            }
        : undefined;

    // TODO add allowlist/hidden settings here

    const data = {
      ...(wallet && { wallet }),
      ...(tokenMint && { tokenMint }),
      ...(price && { price }),
      ...(goLiveDate && { goLiveDate }),
      ...(sellerFeeBasisPoints && { sellerFeeBasisPoints }),
      ...(endSettings !== undefined && { endSettings }),
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
