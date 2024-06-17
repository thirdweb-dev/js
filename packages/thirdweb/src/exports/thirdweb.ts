// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

/**
 * CONSTANTS
 */
export {
  ADDRESS_ZERO,
  ZERO_ADDRESS,
  NATIVE_TOKEN_ADDRESS,
} from "../constants/addresses.js";

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
export { eth_blockNumber } from "../rpc/actions/eth_blockNumber.js";
export { eth_call } from "../rpc/actions/eth_call.js";
export { eth_estimateGas } from "../rpc/actions/eth_estimateGas.js";
export { eth_gasPrice } from "../rpc/actions/eth_gasPrice.js";
export { eth_getBalance } from "../rpc/actions/eth_getBalance.js";
export { eth_getBlockByHash } from "../rpc/actions/eth_getBlockByHash.js";
export { eth_getBlockByNumber } from "../rpc/actions/eth_getBlockByNumber.js";
export { eth_getCode } from "../rpc/actions/eth_getCode.js";
export { eth_getLogs } from "../rpc/actions/eth_getLogs.js";
export { eth_getStorageAt } from "../rpc/actions/eth_getStorageAt.js";
export { eth_getTransactionByHash } from "../rpc/actions/eth_getTransactionByHash.js";
export { eth_getTransactionCount } from "../rpc/actions/eth_getTransactionCount.js";
export { eth_getTransactionReceipt } from "../rpc/actions/eth_getTransactionReceipt.js";
export { eth_maxPriorityFeePerGas } from "../rpc/actions/eth_maxPriorityFeePerGas.js";
export { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";

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
  isBaseTransactionOptions,
  type BaseTransactionOptions,
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
export { estimateGasCost } from "../transaction/actions/estimate-gas-cost.js";
export {
  getGasPrice,
  type GetGasPriceOptions,
} from "../gas/get-gas-price.js";
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
export { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
export { signTransaction } from "../transaction/actions/sign-transaction.js";
export { serializeTransaction } from "../transaction/serialize-transaction.js";
export {
  toSerializableTransaction,
  type ToSerializableTransactionOptions,
} from "../transaction/actions/to-serializable-transaction.js";

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
  getContractEvents,
  type GetContractEventsOptions,
  type GetContractEventsResult,
} from "../event/actions/get-events.js";
export {
  parseEventLogs,
  type ParseEventLogsOptions,
  type ParseEventLogsResult,
} from "../event/actions/parse-logs.js";
export {
  watchContractEvents,
  type WatchContractEventsOptions,
} from "../event/actions/watch-events.js";

/**
 * TYPES
 */
export type { NFT } from "../utils/nft/parseNft.js";

/**
 * UNITS
 */
export { toEther, toTokens, toUnits, toWei, fromGwei } from "../utils/units.js";

export {
  getBuyWithCryptoQuote,
  type BuyWithCryptoQuote,
  type QuoteApprovalParams,
  type QuoteTokenInfo,
  type GetBuyWithCryptoQuoteParams,
} from "../pay/buyWithCrypto/getQuote.js";

export {
  getBuyWithCryptoStatus,
  type BuyWithCryptoStatus,
  type BuyWithCryptoTransaction,
} from "../pay/buyWithCrypto/getStatus.js";

export {
  getBuyWithCryptoHistory,
  type BuyWithCryptoHistoryData,
  type BuyWithCryptoHistoryParams,
} from "../pay/buyWithCrypto/getHistory.js";

export type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../pay/utils/commonTypes.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// hex
export {
  boolToHex,
  // from
  fromHex,
  hexToBigInt,
  hexToBool,
  hexToNumber,
  hexToString,
  hexToUint8Array,
  // util
  isHex,
  numberToHex,
  padHex,
  stringToHex,
  // to
  toHex,
  uint8ArrayToHex,
  type BoolToHexOpts,
  type FromHexParameters,
  type FromHexReturnType,
  type HexToBigIntOpts,
  type HexToBoolOpts,
  type HexToNumberOpts,
  type HexToStringOpts,
  type HexToUint8ArrayOpts,
  type IsHexOptions,
  type NumberToHexOpts,
  type StringToHexOpts,
  type ToHexParameters,
  type Uint8ArrayToHexOpts,
  type Hex,
} from "../utils/encoding/hex.js";
export { concatHex } from "../utils/encoding/helpers/concat-hex.js";

// bytes
// to
export {
  boolToBytes,
  hexToBytes,
  numberToBytes,
  stringToBytes,
  toBytes,
  type BoolToBytesOpts,
  type HexToBytesOpts,
  type StringToBytesOpts,
  type ToBytesParameters,
} from "../utils/encoding/to-bytes.js";
// from
export {
  bytesToBigInt,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  fromBytes,
  type BytesToBigIntOpts,
  type BytesToBoolOpts,
  type BytesToNumberOpts,
  type BytesToStringOpts,
  type FromBytesParameters,
  type FromBytesReturnType,
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
