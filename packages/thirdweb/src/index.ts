// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

/**
 * CLIENT
 */
export {
  createThirdwebClient,
  type CreateThirdwebClientOptions,
  type ThirdwebClient,
} from "./client/client.js";

/**
 * CHAIN
 */
export { type Chain, defineChain } from "./chains/index.js";

/**
 * CONTRACT
 */
export {
  getContract,
  type ContractOptions,
  type ThirdwebContract,
} from "./contract/index.js";

/**
 * TRANSACTIONS
 */

export {
  prepareTransaction,
  type PrepareTransactionOptions,
  type PreparedTransaction,
} from "./transaction/prepare-transaction.js";

export {
  prepareContractCall,
  type PrepareContractCallOptions,
} from "./transaction/prepare-contract-call.js";

export {
  readContract,
  type ReadContractOptions,
} from "./transaction/read-contract.js";

// method resolver
export { resolveMethod } from "./transaction/resolve-method.js";

// transaction actions
export { encode } from "./transaction/actions/encode.js";
export {
  estimateGas,
  type EstimateGasOptions,
} from "./transaction/actions/estimate-gas.js";
export { waitForReceipt } from "./transaction/actions/wait-for-tx-receipt.js";
export {
  sendTransaction,
  type SendTransactionOptions,
} from "./transaction/actions/send-transaction.js";
export {
  simulateTransaction,
  type SimulateOptions,
} from "./transaction/actions/simulate.js";

/**
 * EVENTS
 */
export {
  prepareEvent,
  type PrepareEventOptions,
  type PreparedEvent,
} from "./event/index.js";

// event actions
export {
  watchContractEvents,
  type WatchContractEventsOptions,
} from "./event/actions/watch-events.js";
export {
  getContractEvents,
  type GetContractEventsOptions,
} from "./event/actions/get-events.js";

/**
 * TYPES
 */
export type { NFT } from "./utils/nft/parseNft.js";

/**
 * UNITS
 */
export {
  formatEther,
  formatGwei,
  formatUnits,
  parseEther,
  parseGwei,
  parseUnits,
} from "./utils/units.js";

export {
  getSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "./pay/swap/actions/getSwap.js";

export {
  getSwapStatus,
  type SwapStatus,
  type SwapStatusParams,
} from "./pay/swap/actions/getStatus.js";

export { sendSwap } from "./pay/swap/actions/sendSwap.js";
