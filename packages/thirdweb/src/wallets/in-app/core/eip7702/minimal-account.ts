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
import { randomBytesHex } from "../../../../utils/random.js";
import type {
  Account,
  SendTransactionOption,
} from "../../../interfaces/wallet.js";
import {
  executeWithSignature,
  getQueuedTransactionHash,
} from "../../../smart/lib/bundler.js";
import type { BundlerOptions } from "../../../smart/types.js";

const MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS =
  "0xD6999651Fc0964B9c6B444307a0ab20534a66560";

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
    let authorization: SignedAuthorization | undefined;
    const isMinimalAccount = await is7702MinimalAccount(eoaContract);
    if (!isMinimalAccount) {
      // if not, sign authorization
      let nonce = firstTx.nonce
        ? BigInt(firstTx.nonce)
        : BigInt(
            await getNonce({
              client,
              address: adminAccount.address,
              chain: getCachedChain(firstTx.chainId),
            }),
          );
      nonce += sponsorGas ? 0n : 1n;
      const auth = await adminAccount.signAuthorization?.({
        address: MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS,
        chainId: firstTx.chainId,
        nonce,
      });
      if (!auth) {
        throw new Error("Failed to sign authorization");
      }
      authorization = auth;
    }
    if (sponsorGas) {
      // send transaction from executor, needs signature
      const wrappedCalls = {
        calls: txs.map((tx) => ({
          data: tx.data ?? "0x", // will throw if undefined address
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
        target: tx.to ?? "",
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
      address,
      blockTag: "pending",
    }),
  );
  return nonce;
}

async function is7702MinimalAccount(
  // biome-ignore lint/suspicious/noExplicitAny: TODO properly type tw contract
  eoaContract: ThirdwebContract<any>,
): Promise<boolean> {
  const code = await getBytecode(eoaContract);
  const isDelegated = code.length > 0 && code.startsWith("0xef0100");
  const target = `0x${code.slice(8, 48)}`;
  return (
    isDelegated &&
    target.toLowerCase() ===
      MINIMAL_ACCOUNT_IMPLEMENTATION_ADDRESS.toLowerCase()
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
