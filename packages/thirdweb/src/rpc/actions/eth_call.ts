import type {
  BlockTag,
  EIP1193RequestFn,
  EIP1474Methods,
  Hex,
  RpcStateMapping,
  RpcStateOverride,
  RpcTransactionRequest,
} from "viem";
import { numberToHex } from "../../utils/encoding/hex.js";

type StateOverride = Record<
  string,
  {
    /**
     * Fake balance to set for the account before executing the call.
     */
    balance?: bigint;
    /**
     * Fake nonce to set for the account before executing the call.
     */
    nonce?: number;
    /**
     * Fake EVM bytecode to inject into the account before executing the call.
     */
    code?: Hex;
    /**
     * Fake key-value mapping to override **all** slots in the account storage before executing the call.
     */
    state?: RpcStateMapping;
    /**
     * Fake key-value mapping to override **individual** slots in the account storage before executing the call.
     */
    stateDiff?: RpcStateMapping;
  }
>;

function encodeStateOverrides(overrides: StateOverride): RpcStateOverride {
  return Object.fromEntries(
    Object.entries(overrides).map(([address, override]) => {
      return [
        address,
        {
          balance: override.balance ? numberToHex(override.balance) : undefined,
          nonce: override.nonce ? numberToHex(override.nonce) : undefined,
          code: override.code,
          state: override.state,
          stateDiff: override.stateDiff,
        },
      ];
    }),
  );
}

/**
 * Executes a call or a transaction on the Ethereum network.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for the call or transaction.
 * @returns A promise that resolves to the result of the call or transaction.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_call } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const result = await eth_call(rpcRequest, {
 *  to: "0x...",
 *  ...
 * });
 * ```
 */
export async function eth_call(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: Partial<RpcTransactionRequest> & {
    blockNumber?: bigint | number;
    blockTag?: BlockTag;
    stateOverrides?: StateOverride;
  },
): Promise<Hex> {
  const { blockNumber, blockTag, ...txRequest } = params;
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  // default to "latest" if no block is provided
  const block = blockNumberHex || blockTag || "latest";

  return await request({
    method: "eth_call",
    params: params.stateOverrides
      ? [
          txRequest as Partial<RpcTransactionRequest>,
          block,
          encodeStateOverrides(params.stateOverrides),
        ]
      : [txRequest as Partial<RpcTransactionRequest>, block],
  });
}
