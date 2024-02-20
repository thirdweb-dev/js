// transactions
export {
  prepareTransaction,
  type PrepareTransactionOptions,
  type PreparedTransaction,
} from "./prepare-transaction.js";

export {
  prepareContractCall,
  type PrepareContractCallOptions,
} from "./prepare-contract-call.js";

export {
  readContract,
  type ReadContractOptions,
  type ReadContractResult,
} from "./read-contract.js";

// method resolver
export { resolveMethod } from "./resolve-method.js";

// tx actions (write)
export { encode } from "./actions/encode.js";
export { estimateGas, type EstimateGasResult } from "./actions/estimate-gas.js";
export { waitForReceipt } from "./actions/wait-for-tx-receipt.js";
export {
  sendTransaction,
  type SendTransactionOptions,
} from "./actions/send-transaction.js";
export {
  sendBatchTransaction,
  type SendBatchTransactionOptions,
} from "./actions/send-batch-transaction.js";
export {
  simulateTransaction,
  type SimulateOptions,
} from "./actions/simulate.js";

//types & utils
export {
  type BaseTransactionOptions,
  isBaseTransactionOptions,
} from "./types.js";

export type { WaitForReceiptOptions } from "./actions/wait-for-tx-receipt.js";
