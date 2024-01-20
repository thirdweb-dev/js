import type { ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { RawClient } from "../client/client.js";

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

export function ethers6Adapter() {
  const ethers_ = universalethers;
  assertEthers6(ethers_);
  return {
    toProvider: (client: RawClient, chainId: number) =>
      toProvider(ethers_, client, chainId),
    toContract: (contract: ThirdwebContract, abi?: ethers6.InterfaceAbi) =>
      toContract(ethers_, contract, abi),
  };
}

function toProvider(ethers_: Ethers6, client: RawClient, chainId: number) {
  const url = `https://${chainId}.rpc.thirdweb.com/${client.clientId}`;

  const fetchRequest = new ethers_.FetchRequest(url);
  if (client.secretKey) {
    fetchRequest.setHeader("x-secret-key", client.secretKey);
  }

  return new ethers_.JsonRpcProvider(fetchRequest, chainId, {
    staticNetwork: true,
  });
}

async function toContract(
  ethers_: Ethers6,
  contract: ThirdwebContract,
  abi?: ethers6.InterfaceAbi,
) {
  // TODO handle signers as well
  // resolve the ABI if it is not explicitly passed
  if (!abi) {
    const { resolveAbi } = await import("../abi/resolveContractAbi.js");
    // this is compatible with Ethers6
    abi = (await resolveAbi(contract)) as ethers6.InterfaceAbi;
  }
  const provider = toProvider(ethers_, contract, contract.chainId);
  return new ethers_.Contract(contract.address, abi, provider);
}
