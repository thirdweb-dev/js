import { contract, type ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { ThirdwebClient } from "../client/client.js";
import type { Abi } from "abitype";
import type { IWallet } from "../wallets/interfaces/wallet.js";
import type { Hex, SignableMessage, TransactionSerializable } from "viem";

type Ethers5 = typeof ethers5;

function isEthers5(
  ethers: typeof ethers5 | typeof ethers6,
): ethers is typeof ethers5 {
  return "providers" in ethers;
}

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
      toEthers: (client: ThirdwebClient, chainId: number) =>
        toEthersProvider(ethers, client, chainId),
    },
    contract: {
      toEthers: (twContract: ThirdwebContract) =>
        toEthersContract(ethers, twContract),
      fromEthers: fromEthersContract,
    },
    signer: {
      fromEthers: fromEthersSigner,
    },
  };
})();

function toEthersProvider(
  ethers: Ethers5,
  client: ThirdwebClient,
  chainId: number,
): ethers5.providers.Provider {
  const url = `https://${chainId}.rpc.thirdweb.com/${client.clientId}`;
  const headers: HeadersInit = {};
  if (client.secretKey) {
    headers["x-secret-key"] = client.secretKey;
  }
  return new ethers.providers.JsonRpcProvider({
    url,
    headers: headers,
  });
}

async function toEthersContract<abi extends Abi = []>(
  ethers: Ethers5,
  twContract: ThirdwebContract<abi>,
): Promise<ethers5.Contract> {
  if (twContract.abi) {
    return new ethers.Contract(
      twContract.address,
      JSON.stringify(twContract.abi),
      toEthersProvider(ethers, twContract.client, twContract.chainId),
    );
  }

  const { resolveContractAbi } = await import(
    "../contract/actions/resolve-abi.js"
  );

  const abi = await resolveContractAbi(twContract);

  return new ethers.Contract(
    twContract.address,
    JSON.stringify(abi),
    toEthersProvider(ethers, twContract.client, twContract.chainId),
  );
}

async function fromEthersContract<abi extends Abi>({
  client,
  ethersContract,
  chainId,
}: {
  client: ThirdwebClient;
  ethersContract: ethers5.Contract;
  chainId: number;
}): Promise<ThirdwebContract<abi>> {
  return contract({
    client,
    address: await ethersContract.getAddress(),
    chainId,
  });
}

async function fromEthersSigner(
  signer: ethers5.Signer,
): Promise<IWallet<never>> {
  const address = await signer.getAddress();
  const wallet: IWallet<never> = {
    address,
    connect: async () => {
      return wallet;
    },
    signMessage: async (message: SignableMessage) => {
      return signer.signMessage(
        typeof message === "string" ? message : message.raw,
      ) as Promise<Hex>;
    },
    signTransaction: async (tx: TransactionSerializable) => {
      return signer.signTransaction(alignTx(tx)) as Promise<Hex>;
    },
    sendTransaction: async (
      tx: TransactionSerializable & { chainId: number },
    ) => {
      const res = await signer.sendTransaction(alignTx(tx));
      return res.hash as Hex;
    },
    disconnect: async () => {},
  };
  return wallet;
}

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
