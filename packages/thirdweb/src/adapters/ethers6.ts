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
  const ethers = universalethers;
  assertEthers6(ethers);
  return {
    toProvider: (client: RawClient, chainId: number) =>
      toProvider(ethers, client, chainId),
    toContract: (contract: ThirdwebContract, abi?: ethers6.InterfaceAbi) =>
      toContract(ethers, contract, abi),
  };
}

function toProvider(ethers: Ethers6, client: RawClient, chainId: number) {
  const url = `https://${chainId}.rpc.thirdweb.com/${client.clientId}`;

  const fetchRequest = new ethers.FetchRequest(url);
  if (client.secretKey) {
    fetchRequest.setHeader("x-secret-key", client.secretKey);
  }

  return new ethers.JsonRpcProvider(fetchRequest, chainId, {
    staticNetwork: true,
  });
}

function toContract<abi extends ethers6.InterfaceAbi>(
  ethers: Ethers6,
  contract: ThirdwebContract,
  abi?: abi,
): abi extends ethers6.InterfaceAbi
  ? ethers6.Contract
  : Promise<ethers6.Contract> {
  // TODO handle signers as well
  // resolve the ABI if it is not explicitly passed
  if (!abi) {
    // @ts-expect-error - typescript can't understand this
    return import("../abi/resolveContractAbi.js")
      .then((m) => {
        return m.resolveAbi(contract) as Promise<ethers6.InterfaceAbi>;
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
