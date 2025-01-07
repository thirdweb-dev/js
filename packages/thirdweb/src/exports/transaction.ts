// transactions
export {
  prepareTransaction,
  type PrepareTransactionOptions,
  type PreparedTransaction,
} from "../transaction/prepare-transaction.js";

export {
  prepareContractCall,
  type PrepareContractCallOptions,
} from "../transaction/prepare-contract-call.js";

export {
  readContract,
  type ReadContractOptions,
  type ReadContractResult,
} from "../transaction/read-contract.js";

// method resolver
export { resolveMethod } from "../transaction/resolve-method.js";

// tx actions (write)
export { encode } from "../transaction/actions/encode.js";
export {
  estimateGas,
  type EstimateGasResult,
} from "../transaction/actions/estimate-gas.js";
export {
  estimateGasCost,
  type EstimateGasCostResult,
} from "../transaction/actions/estimate-gas-cost.js";
export { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
export {
  sendTransaction,
  type SendTransactionOptions,
} from "../transaction/actions/send-transaction.js";
export { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
export {
  sendBatchTransaction,
  type SendBatchTransactionOptions,
} from "../transaction/actions/send-batch-transaction.js";
export {
  simulateTransaction,
  type SimulateOptions,
} from "../transaction/actions/simulate.js";
export {
  signTransaction,
  type SignTransactionOptions,
} from "../transaction/actions/sign-transaction.js";
export {
  serializeTransaction,
  type SerializeTransactionOptions,
} from "../transaction/serialize-transaction.js";
export {
  toSerializableTransaction,
  type ToSerializableTransactionOptions,
} from "../transaction/actions/to-serializable-transaction.js";
export {
  type StoredTransaction,
  getTransactionStore,
} from "../transaction/transaction-store.js";
export { populateEip712Transaction } from "../transaction/actions/zksync/send-eip712-transaction.js";

//types & utils
export {
  type BaseTransactionOptions,
  isBaseTransactionOptions,
} from "../transaction/types.js";

export type { WaitForReceiptOptions } from "../transaction/actions/wait-for-tx-receipt.js";

export type { TransactionReceipt } from "viem";

/**
 * Gasless types
 */
export type { GaslessOptions } from "../transaction/actions/gasless/types.js";
export type { EngineOptions } from "../transaction/actions/gasless/providers/engine.js";
export type { OpenZeppelinOptions } from "../transaction/actions/gasless/providers/openzeppelin.js";
export type { BiconomyOptions } from "../transaction/actions/gasless/providers/biconomy.js";

/**
 * EIP-7702
 */
export type {
  AuthorizationRequest,
  SignedAuthorization,
} from "../transaction/actions/eip7702/authorization.js";
export { signAuthorization } from "../transaction/actions/eip7702/authorization.js";
