import { contract, type ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { ThirdwebClient } from "../client/client.js";
import type { Abi } from "abitype";

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
