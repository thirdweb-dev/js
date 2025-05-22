import type { Hex as ox__Hex } from "ox";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Action } from "./BridgeAction.js";
import type { Token } from "./Token.js";

export type Route = {
  originToken: Token;
  destinationToken: Token;
};

export type RouteQuoteStep = {
  originToken: Token;
  destinationToken: Token;
  originAmount: bigint;
  destinationAmount: bigint;
  estimatedExecutionTimeMs: number;
};

export type RouteStep = {
  originToken: Token;
  destinationToken: Token;
  originAmount: bigint;
  destinationAmount: bigint;
  estimatedExecutionTimeMs: number;
  transactions: RouteTransaction[];
};

export type RouteTransaction = {
  data: ox__Hex.Hex;
  to: ox__Hex.Hex;
  value?: bigint | undefined;
  chainId: number;

  /**
   * The action this transaction performs. This can be "approval", "transfer", "buy", or "sell".
   */
  action: Action;
  /**
   * The transaction ID, used for tracking purposes.
   */
  id: ox__Hex.Hex;
  client: ThirdwebClient;
  chain: Chain;
};
