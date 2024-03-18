// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

/**
 * CONSTANTS
 */
export { NATIVE_TOKEN_ADDRESS, ADDRESS_ZERO } from "../constants/addresses.js";

/**
 * CLIENT
 */
export {
  createThirdwebClient,
  type CreateThirdwebClientOptions,
  type ThirdwebClient,
} from "../client/client.js";

/**
 * CHAIN
 */
// chain type
export type { Chain } from "../chains/types.js";
// define chain
export { defineChain } from "../chains/utils.js";

/**
 * RPC
 */
// rpc client
export { getRpcClient } from "../rpc/rpc.js";
// blockNumber watcher
export {
  watchBlockNumber,
  type WatchBlockNumberOptions,
} from "../rpc/watchBlockNumber.js";

// all the actions
export { eth_gasPrice } from "../rpc/actions/eth_gasPrice.js";
export { eth_getBlockByNumber } from "../rpc/actions/eth_getBlockByNumber.js";
export { eth_getBlockByHash } from "../rpc/actions/eth_getBlockByHash.js";
export { eth_getTransactionCount } from "../rpc/actions/eth_getTransactionCount.js";
export { eth_getTransactionReceipt } from "../rpc/actions/eth_getTransactionReceipt.js";
export { eth_maxPriorityFeePerGas } from "../rpc/actions/eth_maxPriorityFeePerGas.js";
export { eth_blockNumber } from "../rpc/actions/eth_blockNumber.js";
export { eth_estimateGas } from "../rpc/actions/eth_estimateGas.js";
export { eth_call } from "../rpc/actions/eth_call.js";
export { eth_getLogs } from "../rpc/actions/eth_getLogs.js";
export { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";
export { eth_getCode } from "../rpc/actions/eth_getCode.js";
export { eth_getBalance } from "../rpc/actions/eth_getBalance.js";
export { eth_getStorageAt } from "../rpc/actions/eth_getStorageAt.js";
export { eth_getTransactionByHash } from "../rpc/actions/eth_getTransactionByHash.js";

/**
 * CONTRACT
 */
export {
  getContract,
  type ContractOptions,
  type ThirdwebContract,
} from "../contract/contract.js";

/**
 * TRANSACTIONS
 */

export {
  prepareTransaction,
  type PrepareTransactionOptions,
  type PreparedTransaction,
} from "../transaction/prepare-transaction.js";

export {
  type BaseTransactionOptions,
  isBaseTransactionOptions,
} from "../transaction/types.js";

export {
  prepareContractCall,
  type PrepareContractCallOptions,
} from "../transaction/prepare-contract-call.js";

export {
  readContract,
  type ReadContractOptions,
} from "../transaction/read-contract.js";

// method resolver
export { resolveMethod } from "../transaction/resolve-method.js";

// transaction actions
export { encode } from "../transaction/actions/encode.js";
export {
  estimateGas,
  type EstimateGasOptions,
} from "../transaction/actions/estimate-gas.js";
export { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
export {
  sendTransaction,
  type SendTransactionOptions,
} from "../transaction/actions/send-transaction.js";
export { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
export {
  simulateTransaction,
  type SimulateOptions,
} from "../transaction/actions/simulate.js";

/**
 * EVENTS
 */
export {
  prepareEvent,
  type PrepareEventOptions,
  type PreparedEvent,
} from "../event/prepare-event.js";

// actions
export {
  parseEventLogs,
  type ParseEventLogsOptions,
  type ParseEventLogsResult,
} from "../event/actions/parse-logs.js";
export {
  watchContractEvents,
  type WatchContractEventsOptions,
} from "../event/actions/watch-events.js";
export {
  getContractEvents,
  type GetContractEventsOptions,
  type GetContractEventsResult,
} from "../event/actions/get-events.js";

/**
 * TYPES
 */
export type { NFT } from "../utils/nft/parseNft.js";

/**
 * UNITS
 */
export { toEther, toTokens, toUnits, toWei } from "../utils/units.js";

export {
  getSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "../pay/swap/actions/getSwap.js";

export {
  getSwapStatus,
  type SwapStatus,
  type SwapStatusParams,
} from "../pay/swap/actions/getStatus.js";

export { sendSwap } from "../pay/swap/actions/sendSwap.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// hex
export {
  // from
  fromHex,
  type FromHexParameters,
  type FromHexReturnType,
  hexToBool,
  type HexToBoolOpts,
  hexToNumber,
  type HexToNumberOpts,
  hexToBigInt,
  type HexToBigIntOpts,
  hexToString,
  type HexToStringOpts,
  hexToUint8Array,
  type HexToUint8ArrayOpts,
  // to
  toHex,
  type ToHexParameters,
  numberToHex,
  type NumberToHexOpts,
  stringToHex,
  type StringToHexOpts,
  uint8ArrayToHex,
  type Uint8ArrayToHexOpts,
  boolToHex,
  type BoolToHexOpts,
  // util
  isHex,
  type IsHexOptions,
  padHex,
} from "../utils/encoding/hex.js";

// bytes
// to
export {
  toBytes,
  type ToBytesParameters,
  boolToBytes,
  type BoolToBytesOpts,
  hexToBytes,
  type HexToBytesOpts,
  numberToBytes,
  stringToBytes,
  type StringToBytesOpts,
} from "../utils/encoding/to-bytes.js";
// from
export {
  fromBytes,
  type FromBytesParameters,
  type FromBytesReturnType,
  bytesToBigInt,
  type BytesToBigIntOpts,
  bytesToNumber,
  type BytesToNumberOpts,
  bytesToString,
  type BytesToStringOpts,
  bytesToBool,
  type BytesToBoolOpts,
} from "../utils/encoding/from-bytes.js";

// ------------------------------------------------
// hashing
// ------------------------------------------------

// keccak256
export { keccak256 } from "../utils/hashing/keccak256.js";

// sha256
export { sha256 } from "../utils/hashing/sha256.js";

// ------------------------------------------------
// address
// ------------------------------------------------
export {
  getAddress,
  isAddress,
  type Address,
  type AddressInput,
} from "../utils/address.js";

// re-exports of types
export type { AbiParameterToPrimitiveType } from "abitype";
