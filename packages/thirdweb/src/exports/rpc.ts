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
