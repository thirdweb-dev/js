import type { Address } from "abitype";
import {
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { toUnits } from "../../../../utils/units.js";
import { isERC721 } from "../../../erc721/read/isERC721.js";
import { isERC1155 } from "../../../erc1155/read/isERC1155.js";
import { createAuction as generatedCreateAuction } from "../../__generated__/IEnglishAuctions/write/createAuction.js";

type MinimumBidAmount =
  | {
      /**
       * The minimum price that a bid must be in order to be accepted. (in Ether)
       */
      minimumBidAmount: string;
    }
  | {
      /**
       * The minimum price that a bid must be in order to be accepted. (in wei)
       */
      minimumBidAmountWei: bigint;
    };

type BuyoutBidAmount =
  | {
      /**
       * The buyout price of the auction. (in Ether)
       */
      buyoutBidAmount: string;
    }
  | {
      /**
       * The buyout price of the auction. (in wei)
       */
      buyoutBidAmountWei: bigint;
    };

export type CreateAuctionParams = {
  /**
   * The contract address of the asset being listed
   */
  assetContractAddress: Address;
  /**
   * The ID of the token being listed
   */
  tokenId: bigint;
  /**
   * The quantity of tokens to list
   *
   * For ERC721s, this value can be omitted.
   * @default 1
   */
  quantity?: bigint;
  /**
   * The contract address of the currency to accept for the listing
   * @default NATIVE_TOKEN_ADDRESS
   */
  currencyContractAddress?: Address;
  /**
   * The start time of the listing
   * @default new Date()
   */
  startTimestamp?: Date;
  /**
   * The end time of the listing
   * @default new Date() + 10 years
   */
  endTimestamp?: Date;

  /**
   * This is a buffer e.g. x seconds.
   *
   * If a new winning bid is made less than x seconds before expirationTimestamp, the
   * expirationTimestamp is increased by x seconds.
   * @default 900 (15 minutes)
   */
  timeBufferInSeconds?: number;

  /**
   * This is a buffer in basis points e.g. x%.
   *
   * To be considered as a new winning bid, a bid must be at least x% greater than
   * the current winning bid.
   * @default 500 (5%)
   */
  bidBufferBps?: number;
} & MinimumBidAmount &
  BuyoutBidAmount;

/**
 * Creates an auction.
 * @param options The options for creating the auction.
 * @returns The result of creating the auction.
 * @extension MARKETPLACE
 * @example
 * ```typescript
 * import { createAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createAuction({...});
 *
 * const { transactionHash } = await sendTransaction({ transaction, account });
 *
 * ```
 */
export function createAuction(
  options: BaseTransactionOptions<CreateAuctionParams>,
) {
  return generatedCreateAuction({
    ...options,
    asyncParams: async () => {
      const assetContract = getContract({
        ...options.contract,
        address: options.assetContractAddress,
      });

      const rpcClient = getRpcClient(options.contract);

      const [assetIsERC721, assetIsERC1155, lastestBlock] = await Promise.all([
        isERC721({ contract: assetContract }),
        isERC1155({ contract: assetContract }),
        eth_getBlockByNumber(rpcClient, { blockTag: "latest" }),
      ]);

      // validate valid asset
      if (!assetIsERC721 && !assetIsERC1155) {
        throw new Error("AssetContract must implement ERC 1155 or ERC 721.");
      }

      // validate the timestamps
      let startTimestamp = BigInt(
        Math.floor((options.startTimestamp ?? new Date()).getTime() / 1000),
      );
      const endTimestamp = BigInt(
        Math.floor(
          (
            options.endTimestamp ??
            new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
          ).getTime() / 1000,
        ),
      );

      if (startTimestamp <= lastestBlock.timestamp) {
        // set the start time to the next block if it is in the past
        startTimestamp = lastestBlock.timestamp + 1n;
      }
      if (startTimestamp >= endTimestamp) {
        throw new Error("Start time must be before end time.");
      }

      // valdiate quantity
      let quantity: bigint;
      if (assetIsERC721) {
        // force quantity to 1 for ERC721s
        quantity = 1n;
      } else {
        // otherwise use the provided quantity or default to 1
        quantity = options.quantity ?? 1n;
      }

      const currencyAddress =
        options.currencyContractAddress ?? NATIVE_TOKEN_ADDRESS;

      // validate buyout bid amount

      let buyoutBidAmount: bigint;
      if ("buyoutBidAmount" in options) {
        // for native token, we know decimals are 18
        if (isNativeTokenAddress(currencyAddress)) {
          buyoutBidAmount = toUnits(options.buyoutBidAmount, 18);
        } else {
          // otherwise get the decimals of the currency
          const currencyContract = getContract({
            ...options.contract,
            address: currencyAddress,
          });
          const { decimals } = await import("../../../erc20/read/decimals.js");
          const currencyDecimals = await decimals({
            contract: currencyContract,
          });
          buyoutBidAmount = toUnits(options.buyoutBidAmount, currencyDecimals);
        }
      } else {
        buyoutBidAmount = BigInt(options.buyoutBidAmountWei);
      }

      // validate buyout bid amount

      let minimumBidAmount: bigint;
      if ("minimumBidAmount" in options) {
        // for native token, we know decimals are 18
        if (isNativeTokenAddress(currencyAddress)) {
          minimumBidAmount = toUnits(options.minimumBidAmount, 18);
        } else {
          // otherwise get the decimals of the currency
          const currencyContract = getContract({
            ...options.contract,
            address: currencyAddress,
          });
          const { decimals } = await import("../../../erc20/read/decimals.js");
          const currencyDecimals = await decimals({
            contract: currencyContract,
          });
          minimumBidAmount = toUnits(
            options.minimumBidAmount,
            currencyDecimals,
          );
        }
      } else {
        minimumBidAmount = BigInt(options.minimumBidAmountWei);
      }

      return {
        params: {
          assetContract: options.assetContractAddress,
          tokenId: options.tokenId,
          currency: options.currencyContractAddress ?? NATIVE_TOKEN_ADDRESS,
          quantity,
          startTimestamp,
          endTimestamp,
          buyoutBidAmount,
          minimumBidAmount,

          // TODO validate these?
          bidBufferBps: BigInt(options.bidBufferBps ?? 500),
          timeBufferInSeconds: BigInt(options.timeBufferInSeconds ?? 900),
        },
        overrides: {
          extraGas: 50_000n, // add extra gas to account for router call
        },
      } as const;
    },
  });
}
