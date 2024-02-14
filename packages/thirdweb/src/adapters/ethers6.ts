import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { Abi } from "abitype";
import type { Hex, TransactionSerializable } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import {
  getRpcUrlForChain,
  type Chain,
  getChainIdFromChain,
} from "../chain/index.js";
import { getContract, type ThirdwebContract } from "../contract/index.js";
import type { Account } from "../wallets/interfaces/wallet.js";

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

  return new ethers.JsonRpcProvider(fetchRequest, getChainIdFromChain(chain), {
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
      return signer.signTransaction(alignTx(tx)) as Promise<Hex>;
    },
    sendTransaction: async (tx) => {
      const transactionHash = (await signer.sendTransaction(alignTx(tx)))
        .hash as Hex;
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
 * Aligns a transaction object to fit the format expected by ethers5 library.
 * @param tx - The transaction object to align.
 * @returns The aligned transaction object.
 * @internal
 */
function alignTx(tx: TransactionSerializable): ethers6.TransactionRequest {
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
