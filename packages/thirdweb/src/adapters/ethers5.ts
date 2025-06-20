import type { Abi } from "abitype";
import * as universalethers from "ethers";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import type { AccessList, Hex } from "viem";
import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract, type ThirdwebContract } from "../contract/contract.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
import {
  type PreparedTransaction,
  TransactionTypeMap,
} from "../transaction/prepare-transaction.js";
import type { SerializableTransaction } from "../transaction/serialize-transaction.js";
import { getAddress } from "../utils/address.js";
import { toHex } from "../utils/encoding/hex.js";
import type { Account } from "../wallets/interfaces/wallet.js";

type Ethers5 = typeof ethers5;

/**
 * Checks if the given ethers object is of type ethers5.
 * @param ethers - The ethers object to check.
 * @returns True if the ethers object is of type ethers5, false otherwise.
 * @internal
 */
function isEthers5(
  ethers: typeof ethers5 | typeof ethers6,
): ethers is typeof ethers5 {
  return "providers" in ethers;
}

/**
 * Asserts that the provided ethers object is of type ethers5.
 * If the object is not of type ethers5, an error is thrown.
 * @param ethers - The ethers object to be asserted.
 * @throws Error - If the ethers object is not of type ethers5.
 * @internal
 */
function assertEthers5(
  ethers: typeof ethers5 | typeof ethers6,
): asserts ethers is typeof ethers5 {
  if (!isEthers5(ethers)) {
    throw new Error(
      "You seem to be using ethers@6, please use the `ethers6Adapter()`",
    );
  }
}

/**
 * The ethers5 adapter provides a way to convert between Thirdweb contracts, accounts, and providers.
 * @example
 *
 * ### Converting a Thirdweb account to an ethers.js signer
 * ```ts
 * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
 * const signer = await ethers5Adapter.signer.toEthers({ client, chain, account });
 * ```
 *
 * ### Converting an ethers.js signer into a Thirdweb account
 * ```ts
 * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
 * const account = await ethers5Adapter.signer.fromEthers({ signer });
 * ```
 *
 * ### Converting a Thirdweb contract to an ethers.js Contract
 * ```ts
 * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
 * const ethersContract = await ethers5Adapter.contract.toEthers({ thirdwebContract });
 * ```
 *
 * ### Converting a Thirdweb client and chain ID into an ethers.js provider
 * ```ts
 * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
 * const provider = ethers5Adapter.provider.toEthers({ client, chain });
 * ```
 */
export const ethers5Adapter = /* @__PURE__ */ (() => {
  const ethers = universalethers;
  return {
    /**
     * Converts a ThirdwebContract to an ethers.js Contract or the other way around.
     * @example
     *
     * ### toEthers
     * ```ts
     * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
     * const ethersContract = await ethers5Adapter.contract.toEthers({
     *   thirdwebContract,
     * });
     * ```
     *
     * ### fromEthers
     * ```ts
     * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
     *
     * const twContract = await ethers5Adapter.contract.fromEthers({
     *  client,
     *  ethersContract,
     *  chain: defineChain(1), // Replace with your chain
     * });
     * ```
     *
     */
    contract: {
      /**
       * Creates a ThirdwebContract instance from an ethers.js contract.
       * @param options - The options for creating the ThirdwebContract instance.
       * @returns A promise that resolves to a ThirdwebContract instance.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       *
       * const twContract = await ethers5Adapter.contract.fromEthers({
       *  client,
       *  ethersContract,
       *  chain: defineChain(1), // Replace with your chain
       * });
       * ```
       */
      fromEthers: (options: FromEthersContractOptions) => {
        assertEthers5(ethers);
        return fromEthersContract(options);
      },
      /**
       * Converts a ThirdwebContract to an ethers.js Contract.
       * @param options - The options for converting the ThirdwebContract to an ethers.js Contract.
       * @param options.thirdwebContract - The ThirdwebContract to convert.
       * @returns A Promise that resolves to an ethers.js Contract.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       * const ethersContract = await ethers5Adapter.contract.toEthers({
       *   thirdwebContract,
       * });
       * ```
       *
       * Once you have converted a thirdweb Contract to an ethers contract,
       * you can interact with it:
       * ```ts
       * // Estimate gas
       * const gasLimit = await contract.estimateGas["functionName"](
       *   ...params,
       * );
       *
       * // Send a transaction
       * const tx = await contract["functionName"](...params, { gasLimit });
       * ```
       *
       */
      toEthers: (options: { thirdwebContract: ThirdwebContract }) => {
        assertEthers5(ethers);
        return toEthersContract(ethers, options.thirdwebContract);
      },
    },
    /**
     * Converts a Thirdweb client and chain ID into an ethers.js provider.
     * @param options - The options for converting the Thirdweb client and chain ID into an ethers.js provider.
     * @param options.client - The Thirdweb client.
     * @param options.chain - The chain.
     * @returns The ethers.js provider.
     * @example
     * ```ts
     * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
     * const provider = ethers5Adapter.provider.toEthers({ client, chainId });
     * ```
     *
     * Once you have converted a thirdweb Client to ethers Provider,
     * you can use it like any other ethers provider:
     * ```ts
     * const blockNumber = await provider.getBlockNumber();
     * ```
     */
    provider: {
      /**
       * Converts a Thirdweb client and chain ID into an ethers.js provider.
       * @param options - The options for converting the Thirdweb client and chain ID into an ethers.js provider.
       * @param options.client - The Thirdweb client.
       * @param options.chain - The chain.
       * @returns The ethers.js provider.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       * const provider = ethers5Adapter.provider.toEthers({ client, chainId });
       * ```
       *
       * Once you have converted a thirdweb Client to ethers Provider,
       * you can use it like any other ethers provider:
       * ```ts
       * const blockNumber = await provider.getBlockNumber();
       * ```
       */
      toEthers: (options: { client: ThirdwebClient; chain: Chain }) => {
        assertEthers5(ethers);
        return toEthersProvider(ethers, options.client, options.chain);
      },
    },
    /**
     * Converts an ethers5 Signer into a Wallet object or the other way around.
     * @example
     *
     * ### fromEthers
     * ```ts
     * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
     * const wallet = await ethers5Adapter.signer.fromEthers({ signer });
     * ```
     *
     * ### toEthers
     * ```ts
     * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
     * const signer = await ethers5Adapter.signer.toEthers({ client, chain, account });
     * ```
     */
    signer: {
      /**
       * Converts an ethers5 Signer into a Wallet object.
       * @param options - The options for converting the ethers5 Signer into a Wallet object.
       * @param options.signer - The ethers5 Signer object.
       * @returns - A Promise that resolves to aa Wallet object.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       * const wallet = await ethers5Adapter.signer.fromEthersSigner({ signer });
       * ```
       */
      fromEthers: (options: { signer: ethers5.Signer }) => {
        assertEthers5(ethers);
        return fromEthersSigner(options.signer);
      },

      /**
       * Converts a Thirdweb wallet to an ethers.js signer.
       * @param options - The options for converting the Thirdweb wallet to an ethers.js signer.
       * @param options.client - The thirdweb client.
       * @param options.chain - The chain.
       * @param options.account - The account.
       * @returns A promise that resolves to an ethers.js signer.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       * const signer = await ethers5Adapter.signer.toEthers({ client, chain, account });
       * ```
       *
       * Once you have the signer, you can perform different tasks using ethers.js as usual:
       * ```ts
       * // Sign message
       * const signature = await signer.signMessage(message);
       *
       * // Get balance
       * const balance = await signer.getBalance();
       * ```
       *
       */
      toEthers: (options: {
        client: ThirdwebClient;
        chain: Chain;
        account: Account;
      }) => {
        assertEthers5(ethers);
        return toEthersSigner(
          ethers,
          options.client,
          options.account,
          options.chain,
        );
      },
    },
  };
})();

/**
 * Converts a Thirdweb client and chain ID into an ethers.js provider.
 * @param ethers - The ethers.js library instance.
 * @param client - The Thirdweb client.
 * @param chain - The chain.
 * @returns The ethers.js provider.
 * @internal
 */
export function toEthersProvider(
  ethers: Ethers5,
  client: ThirdwebClient,
  chain: Chain,
): ethers5.providers.Provider {
  assertEthers5(ethers);
  const url = getRpcUrlForChain({ chain, client });
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (client.secretKey) {
    headers["x-secret-key"] = client.secretKey;
  }
  return new ethers.providers.JsonRpcProvider({
    headers: headers,
    url,
  });
}

/**
 * Converts a ThirdwebContract to an ethers.js Contract.
 * @param ethers - The ethers.js instance.
 * @param twContract - The ThirdwebContract to convert.
 * @returns A Promise that resolves to an ethers.js Contract.
 * @internal
 */
export async function toEthersContract<abi extends Abi = []>(
  ethers: Ethers5,
  twContract: ThirdwebContract<abi>,
): Promise<ethers5.Contract> {
  if (twContract.abi) {
    return new ethers.Contract(
      twContract.address,
      JSON.stringify(twContract.abi),
      toEthersProvider(ethers, twContract.client, twContract.chain),
    );
  }

  const { resolveContractAbi } = await import(
    "../contract/actions/resolve-abi.js"
  );

  const abi = await resolveContractAbi(twContract);

  return new ethers.Contract(
    twContract.address,
    JSON.stringify(abi),
    toEthersProvider(ethers, twContract.client, twContract.chain),
  );
}

type FromEthersContractOptions = {
  client: ThirdwebClient;
  ethersContract: ethers5.Contract;
  chain: Chain;
};

/**
 * Creates a ThirdwebContract instance from an ethers.js contract.
 * @param options - The options for creating the ThirdwebContract instance.
 * @returns A promise that resolves to a ThirdwebContract instance.
 * @internal
 */
export async function fromEthersContract<abi extends Abi>(
  options: FromEthersContractOptions,
): Promise<ThirdwebContract<abi>> {
  return getContract({
    address:
      options.ethersContract.address ||
      (await options.ethersContract.getAddress()),
    chain: options.chain,
    client: options.client,
  });
}

/**
 * Converts an ethers5 Signer into an Account object.
 * @param signer - The ethers5 Signer object.
 * @returns - A Promise that resolves to an Account object.
 * @internal
 */
export async function fromEthersSigner(
  signer: ethers5.Signer,
): Promise<Account> {
  const address = await signer.getAddress();
  const account: Account = {
    address: getAddress(address),
    sendTransaction: async (tx) => {
      const result = await signer.sendTransaction(alignTxToEthers(tx));
      return {
        transactionHash: result.hash as Hex,
      };
    },
    signMessage: async ({ message }) => {
      return signer.signMessage(
        typeof message === "string" ? message : message.raw,
      ) as Promise<Hex>;
    },
    signTransaction: async (tx) => {
      return signer.signTransaction(alignTxToEthers(tx)) as Promise<Hex>;
    },
    signTypedData: async (data) => {
      return (await (signer as ethers5.providers.JsonRpcSigner)._signTypedData(
        data.domain as ethers5.TypedDataDomain,
        data.types as Record<string, ethers5.TypedDataField[]>,
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
        data.message as Record<string, any>,
      )) as Hex;
    },
  };
  return account;
}

/**
 * @internal
 */
export async function toEthersSigner(
  ethers: Ethers5,
  client: ThirdwebClient,
  account: Account,
  chain: Chain,
) {
  class ThirdwebAdapterSigner extends ethers.Signer {
    /**
     * @internal
     */
    constructor() {
      super();
      ethers.utils.defineReadOnly(
        this,
        "provider",
        toEthersProvider(ethers, client, chain),
      );
    }

    /**
     * @internal
     */
    override getAddress(): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return Promise.resolve(account.address);
    }
    /**
     * @internal
     */
    override signMessage(message: string | Uint8Array): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return account.signMessage({
        message: typeof message === "string" ? message : { raw: message },
      });
    }
    /**
     * @internal
     */
    override async signTransaction(
      transaction: ethers5.ethers.utils.Deferrable<ethers5.ethers.providers.TransactionRequest>,
    ): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!account.signTransaction) {
        throw new Error("Account does not support signTransaction");
      }
      const awaitedTx = await ethers.utils.resolveProperties(transaction);
      const alignedTx = await alignTxFromEthers(
        client,
        chain,
        awaitedTx,
        ethers,
      );
      const serialized = await toSerializableTransaction({
        from: account.address,
        transaction: alignedTx,
      });
      return account.signTransaction(serialized);
    }

    /**
     * @internal
     */
    override async sendTransaction(
      transaction: ethers5.ethers.utils.Deferrable<ethers5.ethers.providers.TransactionRequest>,
    ): Promise<ethers5.ethers.providers.TransactionResponse> {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!account.sendTransaction) {
        throw new Error("Account does not support sendTransaction");
      }
      const awaitedTx = await ethers.utils.resolveProperties(transaction);
      const alignedTx = await alignTxFromEthers(
        client,
        chain,
        awaitedTx,
        ethers,
      );
      const serialized = await toSerializableTransaction({
        from: account.address,
        transaction: alignedTx,
      });
      const result = await account.sendTransaction(serialized);

      const response: ethers5.ethers.providers.TransactionResponse = {
        ...serialized,
        accessList: serialized.accessList as ethers5.ethers.utils.AccessList,
        confirmations: 0,
        from: account.address,
        gasLimit: ethers.BigNumber.from(alignedTx.gas ?? 0),
        gasPrice: serialized.gasPrice
          ? ethers.BigNumber.from(serialized.gasPrice)
          : undefined,
        // biome-ignore lint/style/noNonNullAssertion: TODO: fix later
        hash: result.transactionHash!,
        maxFeePerGas: serialized.maxFeePerGas
          ? ethers.BigNumber.from(serialized.maxFeePerGas)
          : undefined,
        maxPriorityFeePerGas: serialized.maxPriorityFeePerGas
          ? ethers.BigNumber.from(serialized.maxPriorityFeePerGas)
          : undefined,
        nonce: Number(serialized.nonce ?? 0),
        type: serialized.type ? TransactionTypeMap[serialized.type] : undefined,
        value: ethers.BigNumber.from(alignedTx.value ?? 0),
        wait: async () => {
          const receipt = await waitForReceipt({
            chain,
            client,
            transactionHash: result.transactionHash,
          });
          return {
            ...receipt,
            blockNumber: Number(receipt.blockNumber),
            byzantium: true,
            confirmations: 1,
            contractAddress: receipt.contractAddress ?? "",
            cumulativeGasUsed: ethers.BigNumber.from(receipt.cumulativeGasUsed),
            effectiveGasPrice:
              receipt.effectiveGasPrice !== null
                ? ethers.BigNumber.from(receipt.effectiveGasPrice)
                : receipt.effectiveGasPrice,
            gasUsed: ethers.BigNumber.from(receipt.gasUsed),
            logs: receipt.logs.map((log) => ({
              ...log,
              blockNumber: Number(log.blockNumber),
            })),
            logsBloom: receipt.logsBloom,
            status: receipt.status === "success" ? 1 : 0,
            to: receipt.to ?? "",
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
            type:
              receipt.type === "legacy"
                ? 0
                : receipt.type === "eip2930"
                  ? 1
                  : receipt.type === "eip1559"
                    ? 2
                    : 3,
          };
        },
      };

      return response;
    }

    async _signTypedData(
      domain: ethers5.ethers.TypedDataDomain,
      types: Record<string, ethers5.ethers.TypedDataField[]>,
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      value: Record<string, any>,
    ): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      const typedDataEncoder = new ethers.utils._TypedDataEncoder(types);

      const typedData = {
        domain: {
          chainId: domain.chainId
            ? bigNumberIshToNumber(domain.chainId)
            : undefined,
          name: domain.name ?? undefined,

          salt: domain.salt ? toHex(domain.salt.toString()) : undefined,
          verifyingContract: domain.verifyingContract ?? undefined,
          version: domain.version ?? undefined,
        },
        message: value,
        primaryType: typedDataEncoder.primaryType,
        types,
      };

      return account.signTypedData(typedData);
    }

    /**
     * @internal
     */
    override connect(): ethers5.ethers.Signer {
      return this;
    }
  }

  return new ThirdwebAdapterSigner();
}

/**
 * Aligns a transaction object to fit the format expected by ethers5 library.
 * @param tx - The transaction object to align.
 * @returns The aligned transaction object.
 * @internal
 */
function alignTxToEthers(
  tx: SerializableTransaction,
): ethers5.ethers.utils.Deferrable<ethers5.ethers.providers.TransactionRequest> {
  const { to: viemTo, type: viemType, gas, ...rest } = tx;
  // massage "to" to fit ethers
  const to = !viemTo ? Promise.resolve(undefined) : viemTo;
  // massage "type" to fit ethers
  let type: number | Promise<undefined>;
  switch (viemType) {
    case "legacy": {
      type = 0;
      break;
    }
    case "eip2930": {
      type = 1;
      break;
    }
    case "eip1559": {
      type = 2;
      break;
    }
    case "eip4844": {
      type = 3;
      break;
    }
    default: {
      type = Promise.resolve(undefined);
      break;
    }
  }

  delete rest.authorizationList;

  return {
    ...rest,
    gasLimit: gas,
    to,
    type,
  } as ethers5.ethers.utils.Deferrable<ethers5.ethers.providers.TransactionRequest>;
}

async function alignTxFromEthers(
  client: ThirdwebClient,
  chain: Chain,
  tx: ethers5.ethers.providers.TransactionRequest,
  ethers: Ethers5,
): Promise<PreparedTransaction> {
  const {
    type: ethersType,
    accessList,
    chainId,
    to,
    data,
    nonce,
    value,
    gasPrice,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = tx;

  switch (ethersType) {
    case 1: {
      if (!chainId) {
        throw new Error("ChainId is required for EIP-2930 transactions");
      }
      return {
        accessList: accessList as AccessList,
        chain,
        client,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
        gasPrice: gasPrice
          ? ethers.BigNumber.from(gasPrice).toBigInt()
          : undefined,
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        to,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
      };
    }
    case 2: {
      if (!chainId) {
        throw new Error("ChainId is required for EIP-1559 transactions");
      }
      return {
        accessList: accessList as AccessList,
        chain,
        client,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
        maxFeePerGas: maxFeePerGas
          ? ethers.BigNumber.from(maxFeePerGas).toBigInt()
          : undefined,
        maxPriorityFeePerGas:
          ethers.BigNumber.from(maxPriorityFeePerGas).toBigInt(),
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        to,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
      };
    }
    default: {
      return {
        chain,
        client,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
        gasPrice: gasPrice
          ? ethers.BigNumber.from(gasPrice).toBigInt()
          : undefined,
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        to,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
      };
    }
  }
}

function bigNumberIshToBigint(value: ethers5.BigNumberish): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  return BigInt(value.toString());
}

function bigNumberIshToNumber(value: ethers5.BigNumberish): number {
  return Number(bigNumberIshToBigint(value));
}
