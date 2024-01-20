import type { ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { RawClient } from "../client/client.js";

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

export function ethers5Adapter() {
  const ethers = universalethers;
  assertEthers5(ethers);
  return {
    toProvider: (client: RawClient, chainId: number) =>
      toProvider(ethers, client, chainId),
    toContract: (contract: ThirdwebContract, abi?: ethers5.ContractInterface) =>
      toContract(ethers, contract, abi),
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

function toContract<abi extends ethers5.ContractInterface>(
  ethers: Ethers5,
  contract: ThirdwebContract,
  abi?: abi,
): abi extends ethers5.ContractInterface
  ? ethers5.Contract
  : Promise<ethers5.Contract> {
  // TODO handle signers as well
  // resolve the ABI if it is not explicitly passed
  if (!abi) {
    // @ts-expect-error - typescript can't understand this
    return import("../abi/resolveContractAbi.js")
      .then((m) => {
        return m.resolveAbi(contract) as Promise<ethers5.ContractInterface>;
      })
      .then((abi_) => {
        // call self again this time with the resolved abi
        return toContract(ethers, contract, abi_);
      });
  }
  const provider = toProvider(ethers, contract, contract.chainId);
  // @ts-expect-error - typescript can't understand this
  return new ethers.Contract(contract.address, abi, provider);
}
