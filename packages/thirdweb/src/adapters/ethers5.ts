import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { Abi } from "abitype";
import type { AccessList, Hex, TransactionSerializable } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { Account, Wallet } from "../wallets/interfaces/wallet.js";
import { defineChain, getRpcUrlForChain } from "../chains/utils.js";
import type { Chain } from "../chains/types.js";
import { getContract, type ThirdwebContract } from "../contract/contract.js";
import { uint8ArrayToHex } from "../utils/encoding/hex.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import { waitForReceipt } from "../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";

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
  assertEthers5(ethers);
  return {
    provider: {
      /**
       * Converts a Thirdweb client and chain ID into an ethers.js provider.
       * @param client - The Thirdweb client.
       * @param chain - The chain.
       * @returns The ethers.js provider.
       * @example
       * ```ts
       * import { ethers5Adapter } from "@thirdweb/adapters";
       * const provider = ethers5Adapter.provider.toEthers(client, chainId);
       * ```
       */
      toEthers: (client: ThirdwebClient, chain: Chain) =>
        toEthersProvider(ethers, client, chain),
    },
    contract: {
      /**
       * Converts a ThirdwebContract to an ethers.js Contract.
       * @param twContract - The ThirdwebContract to convert.
       * @returns A Promise that resolves to an ethers.js Contract.
       * @example
       * ```ts
       * import { ethers5Adapter } from "@thirdweb/adapters";
       * const ethersContract = await ethers5Adapter.contract.toEthers(twContract);
       * ```
       */
      toEthers: (twContract: ThirdwebContract) =>
        toEthersContract(ethers, twContract),
      /**
       * Creates a ThirdwebContract instance from an ethers.js contract.
       * @param options - The options for creating the ThirdwebContract instance.
       * @returns A promise that resolves to a ThirdwebContract instance.
       * @example
       * ```ts
       * import { ethers5Adapter } from "@thirdweb/adapters";
       *
       * const twContract = await ethers5Adapter.contract.fromEthersContract({
       *  client,
       *  ethersContract,
       *  chainId,
       * });
       * ```
       */
      fromEthers: (options: FromEthersContractOptions) =>
        fromEthersContract(options),
    },
    signer: {
      /**
       * Converts an ethers5 Signer into a Wallet object.
       * @param signer - The ethers5 Signer object.
       * @returns - A Promise that resolves to aa Wallet object.
       * @example
       * ```ts
       * import { ethers5Adapter } from "@thirdweb/adapters";
       * const wallet = await ethers5Adapter.signer.fromEthersSigner(signer);
       * ```
       */
      fromEthers: (signer: ethers5.Signer) => fromEthersSigner(signer),

      /**
       * Converts a Thirdweb wallet to an ethers.js signer.
       * @param client - The thirdweb client.
       * @param wallet - The thirdweb wallet.
       * @returns A promise that resolves to an ethers.js signer.
       * @example
       * ```ts
       * import { ethers5Adapter } from "@thirdweb/adapters";
       * const signer = await ethers5Adapter.signer.toEthers(client, chain, account);
       * ```
       */
      toEthers: (client: ThirdwebClient, wallet: Wallet) =>
        toEthersSigner(ethers, client, wallet),
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
        data.message as Record<string, any>,
      )) as Hex;
    },
  };
  return account;
}

async function toEthersSigner(
  ethers: Ethers5,
  client: ThirdwebClient,
  wallet: Wallet,
) {
  const account = wallet.getAccount();
  const chain = wallet.getChain();
  if (!chain) {
    throw new Error("Chain not found");
  }
  if (!account) {
    throw new Error("Account not found");
  }

  class ThirdwebAdapterSigner extends ethers.Signer {
    override getAddress(): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return Promise.resolve(account.address);
    }
    override signMessage(message: string | Uint8Array): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return account.signMessage({
        message:
          typeof message === "string" ? message : uint8ArrayToHex(message),
      });
    }
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

    override async sendTransaction(
      transaction: ethers5.ethers.utils.Deferrable<
        ethers5.ethers.providers.TransactionRequest & { chainId: number }
      >,
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
        client,
        chain: defineChain(await resolvePromisedValue(transaction.chainId)),
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
      const result = await sendTransaction({ transaction: tx, account });

      const response: ethers5.ethers.providers.TransactionResponse = {
        chainId: tx.chain.id,
        from: account.address,
        data: alignedTx.data ?? "0x",
        nonce: alignedTx.nonce ?? -1,
        value: ethers.BigNumber.from(alignedTx.value ?? 0),
        gasLimit: ethers.BigNumber.from(alignedTx.gas ?? 0),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  const { to: viemTo, type: viemType, ...rest } = tx;
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

  return { ...rest, to, type };
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
    // unused here on purpose
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from,
    data,
    nonce,
    value,
    gasPrice,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    ...rest
  } = tx;

  // massage "type" to fit ethers
  let type: string;
  switch (ethersType) {
    case 0: {
      type = "legacy";
      break;
    }
    case 1: {
      type = "eip2930";
      break;
    }
    case 2: {
      type = "eip1559";
      break;
    }
    default: {
      // fall back to legacy
      type = "legacy";
      break;
    }
  }

  return {
    ...rest,
    // access list is the same values just strictly typed
    accessList: accessList as AccessList,
    chainId,
    type,
    to,
    data: (data ?? undefined) as Hex | undefined,
    nonce: nonce ? ethers.BigNumber.from(gasPrice).toNumber() : undefined,
    value: value ? ethers.BigNumber.from(value).toBigInt() : undefined,
    gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice).toBigInt() : undefined,
    gas: gasLimit ? ethers.BigNumber.from(gasLimit).toBigInt() : undefined,
    maxFeePerGas: maxFeePerGas
      ? ethers.BigNumber.from(maxFeePerGas).toBigInt()
      : undefined,
    maxPriorityFeePerGas:
      ethers.BigNumber.from(maxPriorityFeePerGas).toBigInt(),
  };
}
