import type { ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { RawClient } from "../client/client.js";

type Ethers5 = typeof ethers5;

function isEthers5(
  ethers_: typeof ethers5 | typeof ethers6,
): ethers_ is typeof ethers5 {
  return "providers" in ethers_;
}

function assertEthers5(
  ethers_: typeof ethers5 | typeof ethers6,
): asserts ethers_ is typeof ethers5 {
  if (!isEthers5(ethers_)) {
    throw new Error(
      "You seem to be using ethers@6, please use the `ethers6Adapter()",
    );
  }
}

export function ethers5Adapter() {
  const ethers_ = universalethers;
  assertEthers5(ethers_);
  return {
    toProvider: (client: RawClient, chainId: number) =>
      toProvider(ethers_, client, chainId),
    toContract: (contract: ThirdwebContract, abi?: ethers5.ContractInterface) =>
      toContract(ethers_, contract, abi),
  };
}

function toProvider(
  ethers: Ethers5,
  client: RawClient,
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

async function toContract(
  ethers: Ethers5,
  contract: ThirdwebContract,
  abi?: ethers5.ContractInterface,
): Promise<ethers5.Contract> {
  // TODO handle signers as well
  // resolve the ABI if it is not explicitly passed
  if (!abi) {
    const { resolveAbi } = await import("../abi/resolveContractAbi.js");
    // this is compatible with ethers5
    abi = (await resolveAbi(contract)) as ethers5.ContractInterface;
  }
  const provider = toProvider(ethers, contract, contract.chainId);
  return new ethers.Contract(contract.address, abi, provider);
}
