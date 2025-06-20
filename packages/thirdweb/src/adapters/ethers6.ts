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
import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import type { SerializableTransaction } from "../transaction/serialize-transaction.js";
import { getAddress } from "../utils/address.js";
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

/**
 * The ethers6 adapter provides a way to convert between Thirdweb contracts, accounts, and providers.
 * @example
 *
 * ### Converting a Thirdweb account to an ethers.js signer
 * ```ts
 * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
 * const signer = await ethers6Adapter.signer.toEthers({ client, chain, account });
 * ```
 *
 * ### Converting an ethers.js signer into a Thirdweb account
 * ```ts
 * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
 * const account = await ethers6Adapter.signer.fromEthers({ signer });
 * ```
 *
 * ### Converting a Thirdweb contract to an ethers.js Contract
 * ```ts
 * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
 * const ethersContract = await ethers6Adapter.contract.toEthers({ thirdwebContract });
 * ```
 *
 * ### Converting a Thirdweb client and chain ID into an ethers.js provider
 * ```ts
 * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
 * const provider = ethers6Adapter.provider.toEthers({ client, chain });
 * ```
 */
export const ethers6Adapter = /* @__PURE__ */ (() => {
  const ethers = universalethers;

  return {
    /**
     * Converts a ThirdwebContract to an ethers.js Contract or the other way around.
     * @example
     *
     * ### toEthers
     * ```ts
     * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
     * const ethersContract = await ethers6Adapter.contract.toEthers({ thirdwebContract, account });
     * ```
     *
     * ### fromEthers
     * ```ts
     * import { ethers6Adapter } from "thirdweb/adapters";
     * const contract = ethers6Adapter.contract.fromEthers({ client, chain, ethersContract });
     * ```
     */
    contract: {
      /**
       * Creates a ThirdwebContract from an ethers.js Contract.
       * @param options - The options for creating a ThirdwebContract from an ethers.js Contract.
       * @param options.ethersContract - The ethers.js Contract to convert.
       * @param options.chain - The chain.
       * @returns The ThirdwebContract.
       * @example
       * ```ts
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const contract = ethers6Adapter.contract.fromEthers({ ethersContract, chain });
       * ```
       */
      fromEthers: (options: FromEthersContractOptions) => {
        assertEthers6(ethers);
        return fromEthersContract(options);
      },
      /**
       * Converts a ThirdwebContract to an ethers.js Contract.
       * @param options - The options for converting a ThirdwebContract to an ethers.js Contract.
       * @param options.thirdwebContract - The ThirdwebContract to convert.
       * @param options.account - The account to use for signing the transaction.
       * @returns The ethers.js Contract.
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
    },
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
    /**
     * Converts an ethers6 Signer into a Wallet object or the other way around.
     * @example
     *
     * ### fromEthersSigner
     * ```ts
     * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
     * const signer = ethers6Adapter.signer.fromEthersSigner({ signer });
     * ```
     *
     * ### toEthersSigner
     * ```ts
     * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
     * const signer = await ethers6Adapter.signer.toEthers({ client, chain, account });
     * ```
     */
    signer: {
      /**
       * Converts an ethers6 Signer into an thirdweb account.
       * @param options - The options for converting the ethers6 Signer into a thirdweb account.
       * @param options.signer - The ethers6 Signer object.
       * @returns - A Promise that resolves to a thirdweb account.
       * @example
       * ```ts
       * import { ethers6Adapter } from "thirdweb/adapters/ethers6";
       * const account = await ethers6Adapter.signer.fromEthers({ signer });
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
export function toEthersProvider(
  ethers: Ethers6,
  client: ThirdwebClient,
  chain: Chain,
) {
  const url = getRpcUrlForChain({ chain, client });

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
export async function toEthersContract<abi extends Abi = []>(
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
export async function fromEthersContract<abi extends Abi>({
  client,
  ethersContract,
  chain,
}: FromEthersContractOptions): Promise<ThirdwebContract<abi>> {
  return getContract({
    abi: JSON.parse(ethersContract.interface.formatJson()) as abi,
    address: await ethersContract.getAddress(),
    chain,
    client,
  });
}

/**
 * Converts an ethers5 Signer into an Account object.
 * @param signer - The ethers5 Signer object.
 * @returns - A Promise that resolves to an Account object.
 * @internal
 */
export async function fromEthersSigner(
  signer: ethers6.Signer,
): Promise<Account> {
  const address = await signer.getAddress();
  const account: Account = {
    address: getAddress(address),
    sendTransaction: async (tx) => {
      const transactionHash = (
        await signer.sendTransaction(alignTxToEthers(tx))
      ).hash as Hex;
      return {
        transactionHash,
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

    constructor(provider: ethers6.JsonRpcProvider, address: string) {
      super(provider);
      this.address = address;
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
        from: account.address,
        transaction: ethersTx,
      });
      const result = await account.sendTransaction(serializableTx);

      const txResponseParams: ethers6.TransactionResponseParams = {
        ...serializableTx,
        blockHash: null,
        blockNumber: null,
        from: this.address,
        gasLimit: serializableTx.gas as bigint,
        hash: result.transactionHash as string,
        index: 0,
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
        from: account.address,
        transaction: ethersTx,
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
        domain: {
          chainId: domain.chainId
            ? bigNumberIshToNumber(domain.chainId)
            : undefined,
          name: domain.name ?? undefined,
          salt: domain.salt ? toHex(domain.salt) : undefined,
          verifyingContract: domain.verifyingContract ?? undefined,
          version: domain.version ?? undefined,
        },
        message: value,
        primaryType: typedDataEncoder.primaryType,
        types,
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
function alignTxToEthers(tx: SerializableTransaction) {
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
  } as ethers6.TransactionRequest;
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
        accessList: accessList as AccessList,
        chain,
        client,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
        gasPrice: gasPrice ? bigNumberIshToBigint(gasPrice) : undefined,
        nonce: nonce ?? undefined,
        to: (to ?? undefined) as string | undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
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
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
        maxFeePerGas: maxFeePerGas
          ? bigNumberIshToBigint(maxFeePerGas)
          : undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas
          ? bigNumberIshToBigint(maxPriorityFeePerGas)
          : undefined,
        nonce: nonce ?? undefined,
        to: (to ?? undefined) as string | undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
      };
    }
    default: {
      // fall back to legacy
      return {
        chain,
        client,
        data: (data ?? undefined) as Hex | undefined,
        gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
        gasPrice: gasPrice ? bigNumberIshToBigint(gasPrice) : undefined,
        nonce: nonce ?? undefined,
        to: (to ?? undefined) as string | undefined,
        value: value ? bigNumberIshToBigint(value) : undefined,
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
