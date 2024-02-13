import type { Hex, TransactionReceipt } from "viem";
import type { Abi } from "abitype";
import type { TransactionOrUserOpHash } from "../types.js";
import type { ThirdwebContract } from "../../contract/index.js";
import { getChainIdFromChain } from "../../chain/index.js";
import {
  eth_getTransactionReceipt,
  getRpcClient,
  watchBlockNumber,
} from "../../rpc/index.js";
import { getEvents } from "../../index.js";
import { ENTRYPOINT_ADDRESS } from "../../wallets/smart/lib/constants.js";

const MAX_BLOCKS_WAIT_TIME = 10;

const map = new Map<string, Promise<TransactionReceipt>>();

export type WaitForReceiptOptions<abi extends Abi> = TransactionOrUserOpHash & {
  contract: ThirdwebContract<abi>;
};

/**
 * Waits for the transaction receipt of a given transaction hash on a specific contract.
 * @param options - The options for waiting for the receipt.
 * @returns A promise that resolves with the transaction receipt.
 * @transaction
 * @example
 * ```ts
 * import { waitForReceipt } from "thirdweb";
 * const receipt = await waitForReceipt({
 *   contract: myContract,
 *   transactionHash: "0x123...",
 * });
 * ```
 */
export function waitForReceipt<abi extends Abi>(
  options: WaitForReceiptOptions<abi>,
): Promise<TransactionReceipt> {
  const { transactionHash, userOpHash, contract } = options;
  const prefix = transactionHash ? "tx_" : "userOp_";
  const chainId = getChainIdFromChain(contract.chain);
  const key = `${chainId}:${prefix}${transactionHash || userOpHash}`;

  if (map.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.get(key)!;
  }
  const promise = new Promise<TransactionReceipt>((resolve, reject) => {
    // TODO: handle useropHash
    if (!transactionHash && !userOpHash) {
      reject(
        new Error("Transaction has no txHash to wait for, did you execute it?"),
      );
    }

    const request = getRpcClient(contract);

    // start at -1 because the first block doesn't count
    let blocksWaited = -1;

    const unwatch = watchBlockNumber({
      client: contract.client,
      chain: contract.chain,
      onNewBlockNumber: async (blockNumber) => {
        blocksWaited++;
        if (blocksWaited >= MAX_BLOCKS_WAIT_TIME) {
          unwatch();
          reject(new Error("Transaction not found after 10 blocks"));
        }
        try {
          if (transactionHash) {
            const receipt = await eth_getTransactionReceipt(request, {
              hash: transactionHash as Hex,
            });

            // stop the polling
            unwatch();
            // resolve the top level promise with the receipt
            resolve(receipt);
          } else if (userOpHash) {
            // TODO block range configurable?
            const fromBlock =
              blockNumber > 2000n ? blockNumber - 2000n : blockNumber;
            const entryPointContract = {
              address: ENTRYPOINT_ADDRESS,
              chain: contract.chain,
              client: contract.client,
            };
            const events = await getEvents({
              contract: entryPointContract,
              events: [
                {
                  contract: entryPointContract,
                  event: userOpEventAbi,
                },
              ],
              fromBlock,
            });
            // FIXME typing
            const event = events.find(
              (e) => (e.args as any).userOpHash === userOpHash,
            );
            if (event) {
              console.log("event", event);
              const receipt = await eth_getTransactionReceipt(request, {
                hash: event.transactionHash,
              });

              // TODO check if the event has success = false and decode the revert reason

              // stop the polling
              unwatch();
              // resolve the top level promise with the receipt
              resolve(receipt);
            }
          }
        } catch {
          // noop, we'll try again on the next blocks
        }
      },
    });
    // remove the promise from the map when it's done (one way or the other)
  }).finally(() => {
    map.delete(key);
  });

  map.set(key, promise);
  return promise;
}

const userOpEventAbi = {
  type: "event",
  name: "UserOperationEvent",
  inputs: [
    {
      name: "userOpHash",
      type: "bytes32",
      indexed: true,
      internalType: "bytes32",
    },
    { name: "sender", type: "address", indexed: true, internalType: "address" },
    {
      name: "paymaster",
      type: "address",
      indexed: true,
      internalType: "address",
    },
    { name: "nonce", type: "uint256", indexed: false, internalType: "uint256" },
    { name: "success", type: "bool", indexed: false, internalType: "bool" },
    {
      name: "actualGasCost",
      type: "uint256",
      indexed: false,
      internalType: "uint256",
    },
    {
      name: "actualGasUsed",
      type: "uint256",
      indexed: false,
      internalType: "uint256",
    },
  ],
  anonymous: false,
} as const;
