import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { Abi } from "abitype";
import type { AccessList, Hex, TransactionSerializable } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { Account, Wallet } from "../wallets/interfaces/wallet.js";
import { normalizeChainId } from "../wallets/utils/normalizeChainId.js";
import { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
import { uint8ArrayToHex } from "../utils/uint8-array.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { Chain } from "../chains/types.js";
import { getContract, type ThirdwebContract } from "../contract/contract.js";

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
  assertEthers6(ethers);
  return {
    provider: {
      /**
       * Converts a Thirdweb client and chain ID into an ethers.js provider.
       * @param client - The Thirdweb client.
       * @param chain - The chain.
       * @returns The ethers.js provider.
       * @example
       * ```ts
       * import { ethers6Adapter } from "@thirdweb/adapters/erthers6";
       * const provider = ethers6Adapter.provider.toEthers(client, chainId);
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
       * import { ethers6Adapter } from "@thirdweb/adapters/erthers6";
       * const ethersContract = await ethers6Adapter.contract.toEthers(twContract);
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
       * import { ethers6Adapter } from "@thirdweb/adapters/erthers6";
       *
       * const twContract = await ethers6Adapter.contract.fromEthersContract({
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
       * Converts an ethers6 Signer into an Wallet object.
       * @param signer - The ethers6 Signer object.
       * @returns - A Promise that resolves to an Wallet object.
       * @example
       * ```ts
       * import { ethers6Adapter } from "@thirdweb/adapters/erthers6";
       * const wallet = await ethers6Adapter.signer.fromEthersSigner(signer);
       * ```
       */
      fromEthers: (signer: ethers6.Signer) => fromEthersSigner(signer),

      /**
       * Converts a Thirdweb account to an ethers.js signer.
       * @param client - The thirdweb client.
       * @param wallet - The thirdweb wallet.
       * @returns A promise that resolves to an ethers.js signer.
       * @example
       * ```ts
       * import { ethers6Adapter } from "@thirdweb/adapters/erthers6";
       * const signer = await ethers6Adapter.signer.toEthers(client, chain, account);
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
): Promise<ethers6.Contract> {
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
 * @returns A promise that resolves to an ethers.js signer.
 * @internal
 */
async function toEthersSigner(
  ethers: Ethers6,
  client: ThirdwebClient,
  wallet: Wallet,
): Promise<ethers6.Signer> {
  const account = wallet.getAccount();
  const chain = wallet.getChain();
  if (!chain) {
    throw new Error("Chain not found");
  }
  if (!account) {
    throw new Error("Account not found");
  }

  class ThirdwebAdapterSigner extends ethers.AbstractSigner<ethers6.JsonRpcProvider> {
    address: string;
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
    override connect(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _provider: ethers6.ethers.Provider | null,
    ): ethers6.ethers.Signer {
      return this;
    }
    override async sendTransaction(
      tx: ethers6.ethers.TransactionRequest & { chainId: number },
    ): Promise<ethers6.ethers.TransactionResponse> {
      const alignedTx = await alignTxFromEthers(tx);
      if (!account) {
        throw new Error("Account not found");
      }
      const result = await account.sendTransaction({
        ...alignedTx,
        chainId: tx.chainId,
      });

      const txResponseParams: ethers6.TransactionResponseParams = {
        ...alignedTx,
        blockHash: null,
        from: this.address,
        hash: result.transactionHash as string,
        blockNumber: null,
        index: 0,
        gasLimit: alignedTx.gas as bigint,
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
      const viemTx = await alignTxFromEthers(tx);

      return account.signTransaction(viemTx);
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
    override signTypedData(
      domain: ethers6.ethers.TypedDataDomain,
      types: Record<string, ethers6.ethers.TypedDataField[]>,
      value: Record<string, any>,
    ): Promise<string> {
      if (!account) {
        throw new Error("Account not found");
      }
      return account.signTypedData({
        // @ts-expect-error - types don't fully align here but works fine?
        domain: domain ?? undefined,
        types: types ?? undefined,
        message: value,
      });
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
  return { ...rest, type };
}

async function alignTxFromEthers(
  tx: ethers6.TransactionRequest,
): Promise<TransactionSerializable> {
  const {
    type: ethersType,
    accessList,
    chainId: ethersChainId,
    to: ethersTo,
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
  let chainId: number | undefined;
  if (ethersChainId) {
    chainId = normalizeChainId(ethersChainId);
  }

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

  const to = await resolveEthers6Address(ethersTo);

  return {
    ...rest,
    // access list is the same values just strictly typed
    accessList: accessList as AccessList,
    chainId,
    type,
    to,
    data: (data ?? undefined) as Hex | undefined,
    nonce: nonce ?? undefined,
    value: value ? bigNumberIshToBigint(value) : undefined,
    gasPrice: gasPrice ? bigNumberIshToBigint(gasPrice) : undefined,
    gas: gasLimit ? bigNumberIshToBigint(gasLimit) : undefined,
    maxFeePerGas: maxFeePerGas ? bigNumberIshToBigint(maxFeePerGas) : undefined,
    maxPriorityFeePerGas: maxPriorityFeePerGas
      ? bigNumberIshToBigint(maxPriorityFeePerGas)
      : undefined,
  };
}

async function resolveEthers6Address(
  address: ethers6.AddressLike | null | undefined,
): Promise<string | null | undefined> {
  if (!address) {
    return address;
  }
  address = await resolvePromisedValue(address);
  if (typeof address === "string") {
    return address;
  }
  return address.getAddress();
}

function bigNumberIshToBigint(value: ethers6.BigNumberish): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  return BigInt(value);
}
