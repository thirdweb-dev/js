import type { BiconomyOptions } from "./providers/biconomy.js";
import type { EngineOptions } from "./providers/engine.js";
import type { OpenZeppelinOptions } from "./providers/openzeppelin.js";

/**
 * Gasless configs for sending gasless transactions.
 * This config is used in:
 * - [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton)
 * - [`sendTransaction`](https://portal.thirdweb.com/references/typescript/v5/sendTransaction)
 * - [`useSendTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendTransaction)
 * - [`sendAndConfirmTransaction`](https://portal.thirdweb.com/references/typescript/v5/sendAndConfirmTransaction)
 * - [`useSendAndConfirmTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendAndConfirmTransaction)
 *
 * Please refer to the docs of those components above for more info.
 * @transaction
 */
export type GaslessOptions =
  | EngineOptions
  | OpenZeppelinOptions
  | BiconomyOptions;
