import { contract, type ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { ThirdwebClient } from "../client/client.js";
import type { Abi, AbiFunction } from "abitype";
import type { IWallet } from "../wallets/interfaces/wallet.js";
import type { Hex, SignableMessage, TransactionSerializable } from "viem";
import type { Transaction } from "../transaction/transaction.js";

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
      toEthersProvider(ethers, twContract, twContract.chainId),
    );
  }

  const { resolveAbi } = await import("../abi/resolveContractAbi.js");

  const abi = await resolveAbi({
    chainId: twContract.chainId,
    contractAddress: twContract.address,
  });

  return new ethers.Contract(
    twContract.address,
    JSON.stringify(abi),
    toEthersProvider(ethers, twContract, twContract.chainId),
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

      return signer.signTransaction({ ...rest, to, type }) as Promise<Hex>;
    },
    sendTransaction: async <abiFn extends AbiFunction>(
      tx: Transaction<abiFn>,
    ) => {
      const { getRpcClient } = await import("../rpc/index.js");
      const rpcRequest = getRpcClient(tx.contract, {
        chainId: tx.contract.chainId,
      });

      const [getDefaultGasOverrides, encode, transactionCount, estimateGas] =
        await Promise.all([
          import("../gas/fee-data.js").then((m) => m.getDefaultGasOverrides),
          import("../transaction/actions/encode.js").then((m) => m.encode),
          import("../rpc/methods.js").then((m) => m.transactionCount),
          import("../transaction/actions/estimate-gas.js").then(
            (m) => m.estimateGas,
          ),
        ]);

      const [gasOverrides, encodedData, nextNonce, estimatedGas] =
        await Promise.all([
          getDefaultGasOverrides(tx.contract, tx.contract.chainId),
          encode(tx),
          transactionCount(rpcRequest, address),
          estimateGas(tx, { from: address }),
        ]);

      const res = await signer.sendTransaction({
        data: encodedData,
        from: address,
        nonce: nextNonce,
        gasLimit: estimatedGas,
        chainId: tx.contract.chainId,
        to: tx.contract.address,
        ...gasOverrides,
      });
      return res.hash as Hex;
    },
    disconnect: async () => {},
  };
  return wallet;
}
