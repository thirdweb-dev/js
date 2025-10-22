import type { Definition, TypedData } from "ox/TypedData";
import type { Hex, SignableMessage } from "viem";
import type { Chain } from "../../../../chains/types.js";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getBytecode } from "../../../../contract/actions/get-bytecode.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../contract/contract.js";
import { execute } from "../../../../extensions/erc7702/__generated__/MinimalAccount/write/execute.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { SignedAuthorization } from "../../../../transaction/actions/eip7702/authorization.js";
import { toSerializableTransaction } from "../../../../transaction/actions/to-serializable-transaction.js";
import type { SendTransactionResult } from "../../../../transaction/types.js";
import { getAddress } from "../../../../utils/address.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { withCache } from "../../../../utils/promise/withCache.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import {
  executeWithSignature,
  getQueuedTransactionHash,
} from "../../../smart/lib/bundler.js";
import { getDefaultBundlerUrl } from "../../../smart/lib/constants.js";
import type { BundlerOptions } from "../../../smart/types.js";

interface DelegationContractResponse {
  id: string;
  jsonrpc: string;
  result: {
    delegationContract: string;
  };
}

/**
 * Fetches the delegation contract address from the bundler using the tw_getDelegationContract RPC method
 * @internal
 */
async function getDelegationContractAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  bundlerUrl?: string;
}): Promise<string> {
  const { client, chain, bundlerUrl } = args;
  const url = bundlerUrl ?? getDefaultBundlerUrl(chain);

  // Create a cache key based on the bundler URL to ensure we cache per chain/bundler
  const cacheKey = `delegation-contract:${url}`;

  return withCache(
    async () => {
      const fetchWithHeaders = getClientFetch(client);

      const response = await fetchWithHeaders(url, {
        useAuthToken: true,
        body: stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "tw_getDelegationContract",
          params: [],
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch delegation contract: ${response.status} ${response.statusText}`,
        );
      }

      const result: DelegationContractResponse = await response.json();

      if ((result as any).error) {
        throw new Error(
          `Delegation contract RPC error: ${JSON.stringify((result as any).error)}`,
        );
      }

      if (!result.result?.delegationContract) {
        throw new Error(
          "Invalid response: missing delegationContract in result",
        );
      }

      return result.result.delegationContract;
    },
    { cacheKey, cacheTime: 24 * 60 * 60 * 1000 }, // cache for 24 hours
  );
}

/**
 * Creates an EIP-7702 account that enables EOA (Externally Owned Account) delegation
 * to smart contract functionality. This allows an EOA to delegate its code execution
 * to a minimal account contract, enabling features like batch transactions and sponsored gas.
 *
 * The minimal account leverages EIP-7702 authorization to delegate the EOA's code to a
 * MinimalAccount contract, allowing the EOA to execute smart contract functions while
 * maintaining its original address and private key control.
 *
 * @param args - Configuration object for creating the minimal account
 * @param args.client - The thirdweb client instance for blockchain interactions
 * @param args.adminAccount - The EOA account that will be delegated to the minimal account contract
 * @param args.sponsorGas - Optional flag to enable sponsored gas transactions via bundler
 *
 * @returns An Account object with enhanced capabilities including batch transactions and EIP-5792 support
 *
 * @example
 * ```typescript
 * import { createThirdwebClient, sendBatchTransaction } from "thirdweb";
 * import { privateKeyToAccount } from "thirdweb/wallets";
 * import { create7702MinimalAccount } from "thirdweb/wallets/in-app";
 * import { sepolia } from "thirdweb/chains";
 *
 * // Create a client
 * const client = createThirdwebClient({
 *   clientId: "your-client-id"
 * });
 *
 * // Create an EOA account
 * const adminAccount = privateKeyToAccount({
 *   client,
 *   privateKey: "0x..."
 * });
 *
 * // Wrap it with a EIP-7702 account
 * const minimal7702Account = create7702MinimalAccount({
 *   client,
 *   adminAccount,
 *   sponsorGas: true // Enable sponsored transactions
 * });
 *
 * // Send a batch of transactions
 * const result = await sendBatchTransaction({
 *   account: minimal7702Account,
 *   transactions: [
 *   {
 *     to: "0x...",
 *     data: "0x...",
 *     value: 0n,
 *     chainId: sepolia.id
 *   },
 *   {
 *     to: "0x...",
 *     data: "0x...",
 *     value: 0n,
 *     chainId: sepolia.id
 *   }
 * ]});
 *
 * console.log("Batch transaction hash:", result.transactionHash);
 * ```
 *
 * @wallet
 */
export const create7702MinimalAccount = (args: {
  client: ThirdwebClient;
  adminAccount: Account;
  sponsorGas?: boolean;
}): Account => {
  const { client, adminAccount, sponsorGas } = args;

  const _sendTxWithAuthorization = async (txs: SendTransactionOption[]) => {
    const firstTx = txs[0];
    if (!firstTx) {
      throw new Error("No transactions provided");
    }
    const chain = getCachedChain(firstTx.chainId);
    const eoaContract = getContract({
      address: adminAccount.address,
      chain,
      client,
      abi: MinimalAccountAbi,
    });
    // check if account has been delegated already
    let authorization: SignedAuthorization | undefined =
      firstTx.authorizationList?.[0];
    const delegationContractAddress = await getDelegationContractAddress({
      client,
      chain,
    });
    if (
      authorization &&
      authorization.address?.toLowerCase() !==
        delegationContractAddress.toLowerCase()
    ) {
      throw new Error(
        `Authorization address does not match expected delegation contract address. Expected ${delegationContractAddress} but got ${authorization.address}`,
      );
    }
    // if the tx already has an authorization, use it, otherwise sign one
    if (!authorization) {
      const isMinimalAccount = await is7702MinimalAccount(
        eoaContract,
        delegationContractAddress,
      );
      if (!isMinimalAccount) {
        // if not, sign authorization
        let nonce = firstTx.nonce
          ? BigInt(firstTx.nonce)
          : BigInt(
              await getNonce({
                client,
                address: adminAccount.address,
                chain,
              }),
            );
        nonce += sponsorGas ? 0n : 1n;
        const auth = await adminAccount.signAuthorization?.({
          address: getAddress(delegationContractAddress),
          chainId: firstTx.chainId,
          nonce,
        });
        if (!auth) {
          throw new Error("Failed to sign authorization");
        }
        authorization = auth;
      }
    }
    if (sponsorGas) {
      // send transaction from executor, needs signature
      const wrappedCalls = {
        calls: txs.map((tx) => ({
          data: tx.data ?? "0x",
          target: getAddress(tx.to ?? ""),
          value: tx.value ?? 0n,
        })),
        uid: randomBytesHex(),
      };
      const signature = await adminAccount.signTypedData({
        domain: {
          chainId: firstTx.chainId,
          name: "MinimalAccount",
          verifyingContract: eoaContract.address,
          version: "1",
        },
        message: wrappedCalls,
        primaryType: "WrappedCalls",
        types: {
          Call: [
            { name: "target", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
          ],
          WrappedCalls: [
            { name: "calls", type: "Call[]" },
            { name: "uid", type: "bytes32" },
          ],
        },
      });

      const result = await executeWithSignature({
        authorization,
        eoaAddress: getAddress(adminAccount.address),
        options: {
          chain: getCachedChain(firstTx.chainId),
          client,
        },
        signature,
        wrappedCalls,
      });

      const transactionHash = await waitForTransactionHash({
        options: {
          chain: getCachedChain(firstTx.chainId),
          client,
        },
        transactionId: result.transactionId,
      });
      return {
        transactionHash,
      };
    }
    // send transaction from EOA
    // wrap txs in a single execute call to the MinimalAccount
    const executeTx = execute({
      calls: txs.map((tx) => ({
        data: tx.data ?? "0x",
        target: getAddress(tx.to ?? ""),
        value: tx.value ?? 0n,
      })),
      contract: eoaContract,
      overrides: {
        authorizationList: authorization ? [authorization] : undefined,
        value: txs.reduce((acc, tx) => acc + (tx.value ?? 0n), 0n),
      },
    });
    // re-estimate gas for the entire batch + authorization
    const serializedTx = await toSerializableTransaction({
      from: adminAccount.address,
      transaction: executeTx,
    });
    return adminAccount.sendTransaction(serializedTx);
  };

  const minimalAccount: Account = {
    address: adminAccount.address,
    sendBatchTransaction: async (
      txs: SendTransactionOption[],
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization(txs);
    },
    sendTransaction: async (
      tx: SendTransactionOption,
    ): Promise<SendTransactionResult> => {
      return _sendTxWithAuthorization([tx]);
    },
    signMessage: ({
      message,
      originalMessage,
      chainId,
    }: {
      message: SignableMessage;
      originalMessage?: string;
      chainId?: number;
    }): Promise<Hex> =>
      adminAccount.signMessage({ chainId, message, originalMessage }),
    signTypedData: <
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(
      _typedData: Definition<typedData, primaryType>,
    ): Promise<Hex> => adminAccount.signTypedData(_typedData),
    sendCalls: async (options) => {
      const { inAppWalletSendCalls } = await import(
        "../eip5792/in-app-wallet-calls.js"
      );
      const firstCall = options.calls[0];
      if (!firstCall) {
        throw new Error("No calls to send");
      }
      const client = firstCall.client;
      const chain = firstCall.chain || options.chain;
      const id = await inAppWalletSendCalls({
        account: minimalAccount,
        calls: options.calls,
        chain,
      });
      return { chain, client, id };
    },
    getCallsStatus: async (options) => {
      const { inAppWalletGetCallsStatus } = await import(
        "../eip5792/in-app-wallet-calls.js"
      );
      return inAppWalletGetCallsStatus(options);
    },
    getCapabilities: async (options) => {
      return {
        [options.chainId ?? 1]: {
          atomic: {
            status: "supported",
          },
          paymasterService: {
            supported: sponsorGas ?? false,
          },
        },
      };
    },
  };
  return minimalAccount;
};

async function getNonce(args: {
  client: ThirdwebClient;
  address: string;
  chain: Chain;
}): Promise<number> {
  const { client, address, chain } = args;
  const rpcRequest = getRpcClient({
    chain,
    client,
  });
  const nonce = await import(
    "../../../../rpc/actions/eth_getTransactionCount.js"
  ).then(({ eth_getTransactionCount }) =>
    eth_getTransactionCount(rpcRequest, {
      address: getAddress(address),
      blockTag: "pending",
    }),
  );
  return nonce;
}

async function is7702MinimalAccount(
  // biome-ignore lint/suspicious/noExplicitAny: TODO properly type tw contract
  eoaContract: ThirdwebContract<any>,
  delegationContractAddress: string,
): Promise<boolean> {
  const code = await getBytecode(eoaContract);
  const isDelegated = code.length > 0 && code.startsWith("0xef0100");
  const target = `0x${code.slice(8, 48)}`;
  return (
    isDelegated &&
    target.toLowerCase() === delegationContractAddress.toLowerCase()
  );
}

async function waitForTransactionHash(args: {
  options: BundlerOptions;
  transactionId: string;
  timeoutMs?: number;
  intervalMs?: number;
}): Promise<Hex> {
  const timeout = args.timeoutMs || 300000; // 5mins
  const interval = args.intervalMs || 1000; // 1s
  const endtime = Date.now() + timeout;
  while (Date.now() < endtime) {
    const result = await getQueuedTransactionHash({
      options: args.options,
      transactionId: args.transactionId,
    });
    if (result.transactionHash) {
      return result.transactionHash;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(
    `Timeout waiting for transaction to be mined on chain ${args.options.chain.id} with transactionId: ${args.transactionId}`,
  );
}

const MinimalAccountAbi = [
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "createSessionWithSig",
    inputs: [
      {
        name: "sessionSpec",
        type: "tuple",
        internalType: "struct SessionLib.SessionSpec",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "isWildcard", type: "bool", internalType: "bool" },
          { name: "expiresAt", type: "uint256", internalType: "uint256" },
          {
            name: "callPolicies",
            type: "tuple[]",
            internalType: "struct SessionLib.CallSpec[]",
            components: [
              { name: "target", type: "address", internalType: "address" },
              { name: "selector", type: "bytes4", internalType: "bytes4" },
              {
                name: "maxValuePerUse",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "valueLimit",
                type: "tuple",
                internalType: "struct SessionLib.UsageLimit",
                components: [
                  {
                    name: "limitType",
                    type: "uint8",
                    internalType: "enum SessionLib.LimitType",
                  },
                  { name: "limit", type: "uint256", internalType: "uint256" },
                  { name: "period", type: "uint256", internalType: "uint256" },
                ],
              },
              {
                name: "constraints",
                type: "tuple[]",
                internalType: "struct SessionLib.Constraint[]",
                components: [
                  {
                    name: "condition",
                    type: "uint8",
                    internalType: "enum SessionLib.Condition",
                  },
                  { name: "index", type: "uint64", internalType: "uint64" },
                  {
                    name: "refValue",
                    type: "bytes32",
                    internalType: "bytes32",
                  },
                  {
                    name: "limit",
                    type: "tuple",
                    internalType: "struct SessionLib.UsageLimit",
                    components: [
                      {
                        name: "limitType",
                        type: "uint8",
                        internalType: "enum SessionLib.LimitType",
                      },
                      {
                        name: "limit",
                        type: "uint256",
                        internalType: "uint256",
                      },
                      {
                        name: "period",
                        type: "uint256",
                        internalType: "uint256",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "transferPolicies",
            type: "tuple[]",
            internalType: "struct SessionLib.TransferSpec[]",
            components: [
              { name: "target", type: "address", internalType: "address" },
              {
                name: "maxValuePerUse",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "valueLimit",
                type: "tuple",
                internalType: "struct SessionLib.UsageLimit",
                components: [
                  {
                    name: "limitType",
                    type: "uint8",
                    internalType: "enum SessionLib.LimitType",
                  },
                  { name: "limit", type: "uint256", internalType: "uint256" },
                  { name: "period", type: "uint256", internalType: "uint256" },
                ],
              },
            ],
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "verifyingContract", type: "address", internalType: "address" },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      { name: "extensions", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct Call[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "value", type: "uint256", internalType: "uint256" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "executeWithSig",
    inputs: [
      {
        name: "wrappedCalls",
        type: "tuple",
        internalType: "struct WrappedCalls",
        components: [
          {
            name: "calls",
            type: "tuple[]",
            internalType: "struct Call[]",
            components: [
              { name: "target", type: "address", internalType: "address" },
              { name: "value", type: "uint256", internalType: "uint256" },
              { name: "data", type: "bytes", internalType: "bytes" },
            ],
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getCallPoliciesForSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct SessionLib.CallSpec[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "selector", type: "bytes4", internalType: "bytes4" },
          { name: "maxValuePerUse", type: "uint256", internalType: "uint256" },
          {
            name: "valueLimit",
            type: "tuple",
            internalType: "struct SessionLib.UsageLimit",
            components: [
              {
                name: "limitType",
                type: "uint8",
                internalType: "enum SessionLib.LimitType",
              },
              { name: "limit", type: "uint256", internalType: "uint256" },
              { name: "period", type: "uint256", internalType: "uint256" },
            ],
          },
          {
            name: "constraints",
            type: "tuple[]",
            internalType: "struct SessionLib.Constraint[]",
            components: [
              {
                name: "condition",
                type: "uint8",
                internalType: "enum SessionLib.Condition",
              },
              { name: "index", type: "uint64", internalType: "uint64" },
              { name: "refValue", type: "bytes32", internalType: "bytes32" },
              {
                name: "limit",
                type: "tuple",
                internalType: "struct SessionLib.UsageLimit",
                components: [
                  {
                    name: "limitType",
                    type: "uint8",
                    internalType: "enum SessionLib.LimitType",
                  },
                  { name: "limit", type: "uint256", internalType: "uint256" },
                  { name: "period", type: "uint256", internalType: "uint256" },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSessionExpirationForSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSessionStateForSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct SessionLib.SessionState",
        components: [
          {
            name: "transferValue",
            type: "tuple[]",
            internalType: "struct SessionLib.LimitState[]",
            components: [
              { name: "remaining", type: "uint256", internalType: "uint256" },
              { name: "target", type: "address", internalType: "address" },
              { name: "selector", type: "bytes4", internalType: "bytes4" },
              { name: "index", type: "uint256", internalType: "uint256" },
            ],
          },
          {
            name: "callValue",
            type: "tuple[]",
            internalType: "struct SessionLib.LimitState[]",
            components: [
              { name: "remaining", type: "uint256", internalType: "uint256" },
              { name: "target", type: "address", internalType: "address" },
              { name: "selector", type: "bytes4", internalType: "bytes4" },
              { name: "index", type: "uint256", internalType: "uint256" },
            ],
          },
          {
            name: "callParams",
            type: "tuple[]",
            internalType: "struct SessionLib.LimitState[]",
            components: [
              { name: "remaining", type: "uint256", internalType: "uint256" },
              { name: "target", type: "address", internalType: "address" },
              { name: "selector", type: "bytes4", internalType: "bytes4" },
              { name: "index", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransferPoliciesForSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct SessionLib.TransferSpec[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "maxValuePerUse", type: "uint256", internalType: "uint256" },
          {
            name: "valueLimit",
            type: "tuple",
            internalType: "struct SessionLib.UsageLimit",
            components: [
              {
                name: "limitType",
                type: "uint8",
                internalType: "enum SessionLib.LimitType",
              },
              { name: "limit", type: "uint256", internalType: "uint256" },
              { name: "period", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWildcardSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "onERC1155BatchReceived",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC1155Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      { name: "to", type: "address", indexed: true, internalType: "address" },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      { name: "data", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SessionCreated",
    inputs: [
      {
        name: "signer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sessionSpec",
        type: "tuple",
        indexed: false,
        internalType: "struct SessionLib.SessionSpec",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "isWildcard", type: "bool", internalType: "bool" },
          { name: "expiresAt", type: "uint256", internalType: "uint256" },
          {
            name: "callPolicies",
            type: "tuple[]",
            internalType: "struct SessionLib.CallSpec[]",
            components: [
              { name: "target", type: "address", internalType: "address" },
              { name: "selector", type: "bytes4", internalType: "bytes4" },
              {
                name: "maxValuePerUse",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "valueLimit",
                type: "tuple",
                internalType: "struct SessionLib.UsageLimit",
                components: [
                  {
                    name: "limitType",
                    type: "uint8",
                    internalType: "enum SessionLib.LimitType",
                  },
                  { name: "limit", type: "uint256", internalType: "uint256" },
                  { name: "period", type: "uint256", internalType: "uint256" },
                ],
              },
              {
                name: "constraints",
                type: "tuple[]",
                internalType: "struct SessionLib.Constraint[]",
                components: [
                  {
                    name: "condition",
                    type: "uint8",
                    internalType: "enum SessionLib.Condition",
                  },
                  { name: "index", type: "uint64", internalType: "uint64" },
                  {
                    name: "refValue",
                    type: "bytes32",
                    internalType: "bytes32",
                  },
                  {
                    name: "limit",
                    type: "tuple",
                    internalType: "struct SessionLib.UsageLimit",
                    components: [
                      {
                        name: "limitType",
                        type: "uint8",
                        internalType: "enum SessionLib.LimitType",
                      },
                      {
                        name: "limit",
                        type: "uint256",
                        internalType: "uint256",
                      },
                      {
                        name: "period",
                        type: "uint256",
                        internalType: "uint256",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "transferPolicies",
            type: "tuple[]",
            internalType: "struct SessionLib.TransferSpec[]",
            components: [
              { name: "target", type: "address", internalType: "address" },
              {
                name: "maxValuePerUse",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "valueLimit",
                type: "tuple",
                internalType: "struct SessionLib.UsageLimit",
                components: [
                  {
                    name: "limitType",
                    type: "uint8",
                    internalType: "enum SessionLib.LimitType",
                  },
                  { name: "limit", type: "uint256", internalType: "uint256" },
                  { name: "period", type: "uint256", internalType: "uint256" },
                ],
              },
            ],
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ValueReceived",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AllowanceExceeded",
    inputs: [
      { name: "allowanceUsage", type: "uint256", internalType: "uint256" },
      { name: "limit", type: "uint256", internalType: "uint256" },
      { name: "period", type: "uint64", internalType: "uint64" },
    ],
  },
  {
    type: "error",
    name: "CallPolicyViolated",
    inputs: [
      { name: "target", type: "address", internalType: "address" },
      { name: "selector", type: "bytes4", internalType: "bytes4" },
    ],
  },
  { type: "error", name: "CallReverted", inputs: [] },
  {
    type: "error",
    name: "ConditionFailed",
    inputs: [
      { name: "param", type: "bytes32", internalType: "bytes32" },
      { name: "refValue", type: "bytes32", internalType: "bytes32" },
      { name: "condition", type: "uint8", internalType: "uint8" },
    ],
  },
  {
    type: "error",
    name: "InvalidDataLength",
    inputs: [
      { name: "actualLength", type: "uint256", internalType: "uint256" },
      { name: "expectedLength", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidSignature",
    inputs: [
      { name: "msgSender", type: "address", internalType: "address" },
      { name: "thisAddress", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "LifetimeUsageExceeded",
    inputs: [
      { name: "lifetimeUsage", type: "uint256", internalType: "uint256" },
      { name: "limit", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "MaxValueExceeded",
    inputs: [
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "maxValuePerUse", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "NoCallsToExecute", inputs: [] },
  { type: "error", name: "SessionExpired", inputs: [] },
  { type: "error", name: "SessionExpiresTooSoon", inputs: [] },
  { type: "error", name: "SessionZeroSigner", inputs: [] },
  {
    type: "error",
    name: "TransferPolicyViolated",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  { type: "error", name: "UIDAlreadyProcessed", inputs: [] },
] as const;
