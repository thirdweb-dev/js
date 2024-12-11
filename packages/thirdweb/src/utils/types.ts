import type * as ox__Bytes from "ox/Bytes";
import type * as ox__Hex from "ox/Hex";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import type { Prettify } from "./type-utils.js";

/**
 * @internal
 */
export type ClientAndChain = {
  client: ThirdwebClient;
  chain: Chain;
};

/**
 * @internal
 */
export type ClientAndChainAndAccount = Prettify<
  ClientAndChain & { account: Account }
>;

/**
 * A message that can be signed, either as in plaintext or as a raw hex string.
 */
export type SignableMessage =
  | string
  | {
      /** Raw data representation of the message. */
      raw: ox__Hex.Hex | ox__Bytes.Bytes;
    };

/**
 * @internal
 */
export const maxUint96 = 2n ** 96n - 1n;
