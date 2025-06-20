// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

/**
 * UNIVERSAL BRIDGE
 */
export * as Bridge from "../bridge/index.js";
/**
 * CHAIN
 */
// chain type
export type { Chain } from "../chains/types.js";
// define chain
export { defineChain } from "../chains/utils.js";
/**
 * CLIENT
 */
export {
  type CreateThirdwebClientOptions,
  createThirdwebClient,
  type ThirdwebClient,
} from "../client/client.js";
/**
 * CONSTANTS
 */
export {
  NATIVE_TOKEN_ADDRESS,
  /**
   * @deprecated Use {@link ZERO_ADDRESS}.
   */
  ZERO_ADDRESS as ADDRESS_ZERO,
  ZERO_ADDRESS,
} from "../constants/addresses.js";
/**
 * CONTRACT
 */
export {
  type ContractOptions,
  getContract,
  type ThirdwebContract,
} from "../contract/contract.js";
/**
 * ENGINE
 */
export * as Engine from "../engine/index.js";
/**
 * INSIGHT
 */
export * as Insight from "../insight/index.js";
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
 * RPC
 */
// rpc client
export { getRpcClient } from "../rpc/rpc.js";
// blockNumber watcher
export {
  type WatchBlockNumberOptions,
  watchBlockNumber,
} from "../rpc/watchBlockNumber.js";

/**
 * WALLETS
 */
export {
  type GetUserResult,
  getUser,
} from "../wallets/in-app/core/users/getUser.js";

/**
 * TRANSACTIONS
 */

// actions
export {
  type GetContractEventsOptions,
  type GetContractEventsResult,
  getContractEvents,
} from "../event/actions/get-events.js";
export {
  type ParseEventLogsOptions,
  type ParseEventLogsResult,
  parseEventLogs,
} from "../event/actions/parse-logs.js";
export {
  type WatchContractEventsOptions,
  watchContractEvents,
} from "../event/actions/watch-events.js";
/**
 * EVENTS
 */
export {
  type PreparedEvent,
  type PrepareEventOptions,
  prepareEvent,
} from "../event/prepare-event.js";
export {
  type GetGasPriceOptions,
  getGasPrice,
} from "../gas/get-gas-price.js";
export type {
  QuoteApprovalParams,
  QuoteTokenInfo,
} from "../pay/buyWithCrypto/commonTypes.js";
export {
  type BuyWithCryptoHistoryData,
  type BuyWithCryptoHistoryParams,
  getBuyWithCryptoHistory,
} from "../pay/buyWithCrypto/getHistory.js";
export {
  type BuyWithCryptoQuote,
  type GetBuyWithCryptoQuoteParams,
  getBuyWithCryptoQuote,
} from "../pay/buyWithCrypto/getQuote.js";
export {
  type BuyWithCryptoStatus,
  type BuyWithCryptoTransaction,
  getBuyWithCryptoStatus,
} from "../pay/buyWithCrypto/getStatus.js";
export {
  type BuyWithCryptoTransfer,
  type GetBuyWithCryptoTransferParams,
  getBuyWithCryptoTransfer,
} from "../pay/buyWithCrypto/getTransfer.js";
export type {
  PayOnChainTransactionDetails,
  PayTokenInfo,
} from "../pay/utils/commonTypes.js";
// transaction actions
export { encode } from "../transaction/actions/encode.js";
export {
  type EstimateGasOptions,
  estimateGas,
} from "../transaction/actions/estimate-gas.js";
export { estimateGasCost } from "../transaction/actions/estimate-gas-cost.js";
export { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
export {
  type SendBatchTransactionOptions,
  sendBatchTransaction,
} from "../transaction/actions/send-batch-transaction.js";
export {
  type SendTransactionOptions,
  sendTransaction,
} from "../transaction/actions/send-transaction.js";
export { signTransaction } from "../transaction/actions/sign-transaction.js";
export {
  type SimulateOptions,
  simulateTransaction,
} from "../transaction/actions/simulate.js";
export {
  type ToSerializableTransactionOptions,
  toSerializableTransaction,
} from "../transaction/actions/to-serializable-transaction.js";
export { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
export {
  type PrepareContractCallOptions,
  prepareContractCall,
} from "../transaction/prepare-contract-call.js";
export {
  type PreparedTransaction,
  type PrepareTransactionOptions,
  prepareTransaction,
} from "../transaction/prepare-transaction.js";
export {
  type ReadContractOptions,
  readContract,
} from "../transaction/read-contract.js";
// method resolver
export { resolveMethod } from "../transaction/resolve-method.js";
export { serializeTransaction } from "../transaction/serialize-transaction.js";
export {
  type BaseTransactionOptions,
  isBaseTransactionOptions,
} from "../transaction/types.js";
/**
 * TYPES
 */
export type { NFT } from "../utils/nft/parseNft.js";
/**
 * UNITS
 */
export { fromGwei, toEther, toTokens, toUnits, toWei } from "../utils/units.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// from
export {
  type BytesToBigIntOpts,
  type BytesToBoolOpts,
  type BytesToNumberOpts,
  type BytesToStringOpts,
  bytesToBigInt,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  type FromBytesParameters,
  type FromBytesReturnType,
  fromBytes,
} from "../utils/encoding/from-bytes.js";
export { concatHex } from "../utils/encoding/helpers/concat-hex.js";
// hex
export {
  type BoolToHexOpts,
  boolToHex,
  type FromHexParameters,
  type FromHexReturnType,
  // from
  fromHex,
  type Hex,
  type HexToBigIntOpts,
  type HexToBoolOpts,
  type HexToNumberOpts,
  type HexToStringOpts,
  type HexToUint8ArrayOpts,
  hexToBigInt,
  hexToBool,
  hexToNumber,
  hexToString,
  hexToUint8Array,
  type IsHexOptions,
  // util
  isHex,
  type NumberToHexOpts,
  numberToHex,
  padHex,
  type StringToHexOpts,
  stringToHex,
  type ToHexParameters,
  // to
  toHex,
  type Uint8ArrayToHexOpts,
  uint8ArrayToHex,
} from "../utils/encoding/hex.js";
// bytes
// to
export {
  type BoolToBytesOpts,
  boolToBytes,
  type HexToBytesOpts,
  hexToBytes,
  numberToBytes,
  type StringToBytesOpts,
  stringToBytes,
  type ToBytesParameters,
  toBytes,
} from "../utils/encoding/to-bytes.js";

// ------------------------------------------------
// hashing
// ------------------------------------------------

// re-exports of types
export type { AbiParameterToPrimitiveType } from "abitype";
export {
  type VerifyTypedDataParams,
  verifyTypedData,
} from "../auth/verify-typed-data.js";
/**
 * EIP-7702
 */
export type {
  AuthorizationRequest,
  SignedAuthorization,
} from "../transaction/actions/eip7702/authorization.js";
export { signAuthorization } from "../transaction/actions/eip7702/authorization.js";
// ------------------------------------------------
// address
// ------------------------------------------------
export {
  type Address,
  type AddressInput,
  getAddress,
  isAddress,
} from "../utils/address.js";
// keccak256
export { keccak256 } from "../utils/hashing/keccak256.js";
// sha256
export { sha256 } from "../utils/hashing/sha256.js";
export { deploySmartAccount } from "../wallets/smart/lib/signing.js";
