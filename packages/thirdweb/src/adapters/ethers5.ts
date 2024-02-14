import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { Abi } from "abitype";
import type { Hex, TransactionSerializable } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { getRpcUrlForChain, type Chain } from "../chain/index.js";
import { getContract, type ThirdwebContract } from "../contract/index.js";
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
       * import { ethers5Adapter } from "@thirdweb/adapters/erthers5";
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
       * import { ethers5Adapter } from "@thirdweb/adapters/erthers5";
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
       * import { ethers5Adapter } from "@thirdweb/adapters/erthers5";
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
       * import { ethers5Adapter } from "@thirdweb/adapters/erthers5";
       * const wallet = await ethers5Adapter.signer.fromEthersSigner(signer);
       * ```
       */
      fromEthers: (signer: ethers5.Signer) => fromEthersSigner(signer),
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
      return signer.signTransaction(alignTx(tx)) as Promise<Hex>;
    },
    sendTransaction: async (tx) => {
      const result = await signer.sendTransaction(alignTx(tx));
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

/**
 * Aligns a transaction object to fit the format expected by ethers5 library.
 * @param tx - The transaction object to align.
 * @returns The aligned transaction object.
 * @internal
 */
function alignTx(
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
    default: {
      type = Promise.resolve(undefined);
      break;
    }
  }

  return { ...rest, to, type };
}
