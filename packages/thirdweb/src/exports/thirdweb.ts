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
} from "../client/client.js";

/**
 * CHAIN
 */
// chain type
export type { Chain } from "../chains/types.js";
// define chain
export { defineChain } from "../chains/utils.js";

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

export { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "../constants/addresses.js";
