import { contract, type ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { ThirdwebClient } from "../client/client.js";
import type { Abi } from "abitype";

type Ethers6 = typeof ethers6;

function isEthers5(
  ethers_: typeof ethers5 | typeof ethers6,
): ethers_ is typeof ethers5 {
  return "providers" in ethers_;
}

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
  ethers: Ethers6,
  client: ThirdwebClient,
  chainId: number,
) {
  const url = `https://${chainId}.rpc.thirdweb.com/${client.clientId}`;

  const fetchRequest = new ethers.FetchRequest(url);
  if (client.secretKey) {
    fetchRequest.setHeader("x-secret-key", client.secretKey);
  }

  return new ethers.JsonRpcProvider(fetchRequest, chainId, {
    staticNetwork: true,
  });
}

async function toEthersContract<abi extends Abi = []>(
  ethers: Ethers6,
  twContract: ThirdwebContract<abi>,
): Promise<ethers6.Contract> {
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
  ethersContract: ethers6.Contract;
  chainId: number;
}): Promise<ThirdwebContract<abi>> {
  return contract({
    client,
    address: await ethersContract.getAddress(),
    abi: JSON.parse(ethersContract.interface.formatJson()) as abi,
    chainId,
  });
}
