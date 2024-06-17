import type { Abi } from "abitype";
import * as universalethers from "ethers";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import type { AccessList, Hex, TransactionSerializable } from "viem";
import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { type ThirdwebContract, getContract } from "../contract/contract.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
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
      "You seem to be using ethers@6, please use the `ethers6Adapter()",
    );
  }
}

export const ethers5Adapter = /* @__PURE__ */ (() => {
  const ethers = universalethers;
  return {
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
       */
      toEthers: (options: { client: ThirdwebClient; chain: Chain }) => {
        assertEthers5(ethers);
        return toEthersProvider(ethers, options.client, options.chain);
      },
    },
    contract: {
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
       */
      toEthers: (options: { thirdwebContract: ThirdwebContract }) => {
        assertEthers5(ethers);
        return toEthersContract(ethers, options.thirdwebContract);
      },

      /**
       * Creates a ThirdwebContract instance from an ethers.js contract.
       * @param options - The options for creating the ThirdwebContract instance.
       * @returns A promise that resolves to a ThirdwebContract instance.
       * @example
       * ```ts
       * import { ethers5Adapter } from "thirdweb/adapters/ethers5";
       *
       * const twContract = await ethers5Adapter.contract.fromEthersContract({
       *  client,
       *  ethersContract,
       *  chainId,
       * });
       * ```
       */
      fromEthers: (options: FromEthersContractOptions) => {
        assertEthers5(ethers);
        return fromEthersContract(options);
      },
    },
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
function toEthersProvider(
  ethers: Ethers5,
  client: ThirdwebClient,
  chain: Chain,
): ethers5.providers.Provider {
  const url = getRpcUrlForChain({ chain, client });
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (client.secretKey) {
    headers["x-secret-key"] = client.secretKey;
  }
  return new ethers.providers.JsonRpcProvider({
    url,
    headers: headers,
  });
}

/**
 * Converts a ThirdwebContract to an ethers.js Contract.
 * @param ethers - The ethers.js instance.
 * @param twContract - The ThirdwebContract to convert.
 * @returns A Promise that resolves to an ethers.js Contract.
 * @internal
 */
async function toEthersContract<abi extends Abi = []>(
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
async function fromEthersContract<abi extends Abi>(
  options: FromEthersContractOptions,
): Promise<ThirdwebContract<abi>> {
  return getContract({
    client: options.client,
    address: await options.ethersContract.getAddress(),
    chain: options.chain,
  });
}

/**
 * Converts an ethers5 Signer into an Account object.
 * @param signer - The ethers5 Signer object.
 * @returns - A Promise that resolves to an Account object.
 * @internal
 */
async function fromEthersSigner(signer: ethers5.Signer): Promise<Account> {
  const address = await signer.getAddress();
  const account: Account = {
    address,
    signMessage: async ({ message }) => {
      return signer.signMessage(
        typeof message === "string" ? message : message.raw,
      ) as Promise<Hex>;
    },
    signTransaction: async (tx) => {
      return signer.signTransaction(alignTxToEthers(tx)) as Promise<Hex>;
    },
    sendTransaction: async (tx) => {
      const result = await signer.sendTransaction(alignTxToEthers(tx));
      return {
        transactionHash: result.hash as Hex,
      };
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
      return account.signTransaction(
        await alignTxFromEthers(awaitedTx, ethers),
      );
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
      const alignedTx = await alignTxFromEthers(awaitedTx, ethers);
      const tx = prepareTransaction({
        client: client,
        chain: chain,
        accessList: alignedTx.accessList,
        data: alignedTx.data,
        gas: alignedTx.gas,
        maxFeePerGas: alignedTx.maxFeePerGas,
        gasPrice: alignedTx.gasPrice,
        maxFeePerBlobGas: alignedTx.maxFeePerGas,
        maxPriorityFeePerGas: alignedTx.maxPriorityFeePerGas,
        nonce: alignedTx.nonce,
        to: alignedTx.to ?? undefined,
        value: alignedTx.value,
      });
      const result = await sendTransaction({
        transaction: tx,
        account: account,
      });

      const response: ethers5.ethers.providers.TransactionResponse = {
        chainId: tx.chain.id,
        from: account.address,
        data: alignedTx.data ?? "0x",
        nonce: alignedTx.nonce ?? -1,
        value: ethers.BigNumber.from(alignedTx.value ?? 0),
        gasLimit: ethers.BigNumber.from(alignedTx.gas ?? 0),
        // biome-ignore lint/style/noNonNullAssertion: TODO: fix later
        hash: result.transactionHash!,
        confirmations: 0,
        wait: async () => {
          const receipt = await waitForReceipt(result);
          return {
            ...receipt,
            type:
              receipt.type === "legacy"
                ? 0
                : receipt.type === "eip2930"
                  ? 1
                  : receipt.type === "eip1559"
                    ? 2
                    : 3,
            status: receipt.status === "success" ? 1 : 0,
            blockNumber: Number(receipt.blockNumber),
            to: receipt.to ?? "",
            confirmations: 1,
            contractAddress: receipt.contractAddress ?? "",
            transactionIndex: receipt.transactionIndex,
            gasUsed: ethers.BigNumber.from(receipt.gasUsed),
            logsBloom: receipt.logsBloom,
            transactionHash: receipt.transactionHash,
            logs: receipt.logs.map((log) => ({
              ...log,
              blockNumber: Number(log.blockNumber),
            })),
            cumulativeGasUsed: ethers.BigNumber.from(receipt.cumulativeGasUsed),
            effectiveGasPrice: ethers.BigNumber.from(receipt.effectiveGasPrice),
            byzantium: true,
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
        primaryType: typedDataEncoder.primaryType,
        domain: {
          chainId: domain.chainId
            ? bigNumberIshToNumber(domain.chainId)
            : undefined,
          name: domain.name ?? undefined,

          salt: domain.salt ? toHex(domain.salt.toString()) : undefined,
          verifyingContract: domain.verifyingContract ?? undefined,
          version: domain.version ?? undefined,
        },
        types,
        message: value,
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
  tx: TransactionSerializable,
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

  return {
    ...rest,
    gasLimit: gas,
    to,
    type,
    accessList: tx.accessList as ethers5.utils.AccessListish | undefined,
  };
}

async function alignTxFromEthers(
  tx: ethers5.ethers.providers.TransactionRequest,
  ethers: Ethers5,
): Promise<TransactionSerializable> {
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
        type: "eip2930",
        chainId,
        to,
        data: (data ?? undefined) as Hex | undefined,
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
        gasPrice: gasPrice
          ? ethers.BigNumber.from(gasPrice).toBigInt()
          : undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
        accessList: accessList as AccessList,
      };
    }
    case 2: {
      if (!chainId) {
        throw new Error("ChainId is required for EIP-1559 transactions");
      }
      return {
        type: "eip1559",
        chainId,
        to,
        data: (data ?? undefined) as Hex | undefined,
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
        maxFeePerGas: maxFeePerGas
          ? ethers.BigNumber.from(maxFeePerGas).toBigInt()
          : undefined,
        maxPriorityFeePerGas:
          ethers.BigNumber.from(maxPriorityFeePerGas).toBigInt(),
        accessList: accessList as AccessList,
      };
    }
    default: {
      return {
        type: "legacy",
        chainId,
        to,
        data: (data ?? undefined) as Hex | undefined,
        nonce: nonce ? ethers.BigNumber.from(nonce).toNumber() : undefined,
        value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
        gasPrice: gasPrice
          ? ethers.BigNumber.from(gasPrice).toBigInt()
          : undefined,
        gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
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
