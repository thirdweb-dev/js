import type { Abi } from "abitype";
import * as universalethers from "ethers";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import type { AccessList, Hex, TransactionSerializable } from "viem";
import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { type ThirdwebContract, getContract } from "../contract/contract.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import { toHex } from "../utils/encoding/hex.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { normalizeChainId } from "../wallets/utils/normalizeChainId.js";

type Ethers6 = typeof ethers6;

/**
 * Checks if the given ethers object is of type ethers5.
 * @param ethers - The ethers object to check.
 * @returns True if the ethers object is of type ethers5, false otherwise.
 * @internal
 */
function isEthers5(
  ethers_: typeof ethers5 | typeof ethers6,
): ethers_ is typeof ethers5 {
  return "providers" in ethers_;
}

/**
 * Asserts that the provided ethers object is of type ethers5.
 * If the object is not of type ethers5, an error is thrown.
 * @param ethers - The ethers object to be asserted.
 * @throws Error - If the ethers object is not of type ethers5.
 * @internal
 */
function assertEthers6(
  ethers_: typeof ethers5 | typeof ethers6,
): asserts ethers_ is typeof ethers6 {
  if (isEthers5(ethers_)) {
    throw new Error(
      "You seem to be using ethers@5, please use the `ethers5Adapter()",
    );
  }
}

export const ethers6Adapter = /* @__PURE__ */ (() => {
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
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const provider = ethers6Adapter.provider.toEthers({ client, chain });
       * ```
       */
      toEthers: (options: { client: ThirdwebClient; chain: Chain }) => {
        assertEthers6(ethers);
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
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const ethersContract = await ethers6Adapter.contract.toEthers({ thirdwebContract });
       * ```
       */
      toEthers: (options: {
        thirdwebContract: ThirdwebContract;
        account?: Account;
      }) => {
        assertEthers6(ethers);
        return toEthersContract(
          ethers,
          options.thirdwebContract,
          options.account,
        );
      },
      /**
       * Creates a ThirdwebContract instance from an ethers.js contract.
       * @param options - The options for creating the ThirdwebContract instance.
       * @returns A promise that resolves to a ThirdwebContract instance.
       * @example
       * ```ts
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       *
       * const twContract = await ethers6Adapter.contract.fromEthersContract({
       *  client,
       *  ethersContract,
       *  chainId,
       * });
       * ```
       */
      fromEthers: (options: FromEthersContractOptions) => {
        assertEthers6(ethers);
        return fromEthersContract(options);
      },
    },
    signer: {
      /**
       * Converts an ethers6 Signer into an Wallet object.
       * @param options - The options for converting the ethers6 Signer into a Wallet object.
       * @param options.signer - The ethers6 Signer object.
       * @returns - A Promise that resolves to an Wallet object.
       * @example
       * ```ts
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const wallet = await ethers6Adapter.signer.fromEthersSigner({ signer });
       * ```
       */
      fromEthers: (options: { signer: ethers6.Signer }) => {
        assertEthers6(ethers);
        return fromEthersSigner(options.signer);
      },

      /**
       * Converts a Thirdweb wallet to an ethers.js signer.
       * @param options - The options for converting the Thirdweb wallet to an ethers.js signer.
       * @param options.client - The thirdweb client.
       * @param options.account - The account.
       * @param options.chain - The chain.
       * @returns A promise that resolves to an ethers.js signer.
       * @example
       * ```ts
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const signer = await ethers6Adapter.signer.toEthers({ client, chain, account });
       * ```
       */
      toEthers: (options: {
        client: ThirdwebClient;
        account: Account;
        chain: Chain;
      }) => {
        assertEthers6(ethers);
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
  ethers: Ethers6,
  client: ThirdwebClient,
  chain: Chain,
) {
  const url = getRpcUrlForChain({ client, chain });

  const fetchRequest = new ethers.FetchRequest(url);
  if (client.secretKey) {
    fetchRequest.setHeader("x-secret-key", client.secretKey);
    fetchRequest.setHeader("Content-Type", "application/json");
  }

  return new ethers.JsonRpcProvider(fetchRequest, chain.id, {
    staticNetwork: true,
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
  ethers: Ethers6,
  twContract: ThirdwebContract<abi>,
  account?: Account,
): Promise<ethers6.Contract> {
  if (twContract.abi) {
    return new ethers.Contract(
      twContract.address,
      JSON.stringify(twContract.abi),
      account
        ? toEthersSigner(ethers, twContract.client, account, twContract.chain)
        : toEthersProvider(ethers, twContract.client, twContract.chain),
    );
  }

  const { resolveContractAbi } = await import(
    "../contract/actions/resolve-abi.js"
  );

  const abi = await resolveContractAbi(twContract);

  return new ethers.Contract(
    twContract.address,
    JSON.stringify(abi),
    account
      ? toEthersSigner(ethers, twContract.client, account, twContract.chain)
      : toEthersProvider(ethers, twContract.client, twContract.chain),
  );
}

type FromEthersContractOptions = {
  client: ThirdwebClient;
  ethersContract: ethers6.Contract;
  chain: Chain;
};

/**
 * Creates a ThirdwebContract instance from an ethers.js contract.
 * @param options - The options for creating the ThirdwebContract instance.
 * @returns A promise that resolves to a ThirdwebContract instance.
 * @internal
 */
async function fromEthersContract<abi extends Abi>({
  client,
  ethersContract,
  chain,
}: FromEthersContractOptions): Promise<ThirdwebContract<abi>> {
  return getContract({
    client,
    address: await ethersContract.getAddress(),
    abi: JSON.parse(ethersContract.interface.formatJson()) as abi,
    chain,
  });
}

/**
 * Converts an ethers5 Signer into an Account object.
 * @param signer - The ethers5 Signer object.
 * @returns - A Promise that resolves to an Account object.
 * @internal
 */
async function fromEthersSigner(signer: ethers6.Signer): Promise<Account> {
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
      const transactionHash = (
        await signer.sendTransaction(alignTxToEthers(tx))
      ).hash as Hex;
      return {
        transactionHash,
      };
    },
    signTypedData: async (data) => {
      return (await signer.signTypedData(
        data.domain as ethers6.TypedDataDomain,
        data.types as Record<string, ethers6.ethers.TypedDataField[]>,
        // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
        data.message as Record<string, any>,
      )) as Hex;
    },
  };

  return account;
}

/**
 * Converts a Thirdweb account to an ethers.js signer.
 * @param ethers - The ethers.js library.
 * @param client - The Thirdweb client.
 * @param chain - The blockchain chain.
 * @param account - The Thirdweb account.
 * @returns An ethers.js signer.
 * @internal
 */
export function toEthersSigner(
  ethers: Ethers6,
  client: ThirdwebClient,
  account: Account,
  chain: Chain,
): ethers6.Signer {
  class ThirdwebAdapterSigner extends ethers.AbstractSigner<ethers6.JsonRpcProvider> {
    private address: string;
    override provider: ethers6.ethers.JsonRpcProvider;

    constructor(provider: ethers6.JsonRpcProvider, address: string) {
      super(provider);
      this.address = address;
      this.provider = provider;
    }

    override async getAddress(): Promise<string> {
      // needs to be a promise because ethers6 returns a promise
      return this.address;
    }

    override connect(): ethers6.ethers.Signer {
      return this;
    }

    override async sendTransaction(
      tx: ethers6.ethers.TransactionRequest,
    ): Promise<ethers6.ethers.TransactionResponse> {
      if (!account) {
        throw new Error("Account not found");
      }
      const ethersTx = await alignTxFromEthers({
        chain,
        client,
        tx,
      });
      const serializableTx = await toSerializableTransaction({
        transaction: ethersTx,
        from: account.address,
      });
      const result = await account.sendTransaction(serializableTx);

      const txResponseParams: ethers6.TransactionResponseParams = {
        ...serializableTx,
        blockHash: null,
        from: this.address,
        hash: result.transactionHash as string,
        blockNumber: null,
        index: 0,
        gasLimit: serializableTx.gas as bigint,
        // @ts-expect-error - we don't have this reliably so we'll just not include it
        signature: null,
      };

      return new ethers.TransactionResponse(txResponseParams, this.provider);
    }

    override async signTransaction(
      tx: ethers6.ethers.TransactionRequest,
    ): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!account.signTransaction) {
        throw new Error("Account does not support signing transactions");
      }
      const ethersTx = await alignTxFromEthers({
        chain,
        client,
        tx,
      });
      const serializableTx = await toSerializableTransaction({
        transaction: ethersTx,
        from: account.address,
      });
      return account.signTransaction(serializableTx);
    }

    override signMessage(message: string | Uint8Array): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return account.signMessage({
        message: typeof message === "string" ? message : { raw: message },
      });
    }

    override signTypedData(
      domain: ethers6.ethers.TypedDataDomain,
      types: Record<string, ethers6.ethers.TypedDataField[]>,
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      value: Record<string, any>,
    ): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      const typedDataEncoder = new ethers.TypedDataEncoder(types);

      const typedData = {
        primaryType: typedDataEncoder.primaryType,
        domain: {
          chainId: domain.chainId
            ? bigNumberIshToNumber(domain.chainId)
            : undefined,
          name: domain.name ?? undefined,
          salt: domain.salt ? toHex(domain.salt) : undefined,
          verifyingContract: domain.verifyingContract ?? undefined,
          version: domain.version ?? undefined,
        },
        types,
        message: value,
      };

      return account.signTypedData(typedData);
    }
  }
  return new ThirdwebAdapterSigner(
    toEthersProvider(ethers, client, chain),
    account.address,
  );
}

/**
 * Aligns a transaction object to fit the format expected by ethers6 library.
 * @param tx - The transaction object to align.
 * @returns The aligned transaction object.
 * @internal
 */
function alignTxToEthers(
  tx: TransactionSerializable,
): ethers6.TransactionRequest {
  const { type: viemType, ...rest } = tx;

  // massage "type" to fit ethers
  let type: number | null;
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
    default: {
      type = null;
      break;
    }
  }
  return {
    ...rest,
    type,
    accessList: tx.accessList as ethers6.AccessListish | null | undefined,
  };
}

async function alignTxFromEthers(options: {
  client: ThirdwebClient;
  chain: Chain;
  tx: ethers6.TransactionRequest;
}): Promise<PreparedTransaction> {
  const { client, chain, tx } = options;
  const {
    type: ethersType,
    accessList,
    chainId: ethersChainId,
    to: ethersTo,
    data,
    nonce,
    value,
    gasPrice,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = tx;
  let chainId: number | undefined;
  if (ethersChainId) {
    chainId = normalizeChainId(ethersChainId);
  }

  const to = await resolveEthers6Address(ethersTo);

  // massage "type" to fit ethers
  switch (ethersType) {
    case 1: {
      if (!chainId) {
        throw new Error("ChainId is required for EIP-2930 transactions");
      }
      return {
        client,
        chain,
        accessList: accessList as AccessList,
        to: (to ?? undefined) as string | undefined,
        data: (data ?? undefined) as Hex | undefined,
        gasPrice: gasPrice ? bigNumberIshToBigint(gasPrice) : undefined,
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
        nonce: nonce ?? undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
      };
    }
    case 2: {
      if (!chainId) {
        throw new Error("ChainId is required for EIP-1559 transactions");
      }
      return {
        client,
        chain,
        accessList: accessList as AccessList,
        to: (to ?? undefined) as string | undefined,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
        nonce: nonce ?? undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
        maxFeePerGas: maxFeePerGas
          ? bigNumberIshToBigint(maxFeePerGas)
          : undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas
          ? bigNumberIshToBigint(maxPriorityFeePerGas)
          : undefined,
      };
    }
    default: {
      // fall back to legacy
      return {
        client,
        chain,
        to: (to ?? undefined) as string | undefined,
        data: (data ?? undefined) as Hex | undefined,
        nonce: nonce ?? undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
        gasPrice: gasPrice ? bigNumberIshToBigint(gasPrice) : undefined,
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
      };
    }
  }
}

async function resolveEthers6Address(
  address: ethers6.AddressLike | null | undefined,
): Promise<string | null | undefined> {
  if (!address) {
    return address;
  }
  let resolvedAddress = address;
  if (resolvedAddress) {
    resolvedAddress = await resolvePromisedValue(resolvedAddress);
  }
  if (typeof resolvedAddress === "string") {
    return resolvedAddress;
  }
  return resolvedAddress?.getAddress();
}

function bigNumberIshToBigint(value: ethers6.BigNumberish): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  return BigInt(value);
}

function bigNumberIshToNumber(value: ethers6.BigNumberish): number {
  return Number(bigNumberIshToBigint(value));
}
