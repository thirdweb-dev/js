import type { ThirdwebContract } from "../contract/index.js";
import type * as ethers5 from "ethers5";
import type * as ethers6 from "ethers6";
import * as universalethers from "ethers";
import type { ThirdwebClient } from "../client/client.js";

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
    provider: (client: ThirdwebClient, chainId: number) =>
      provider(ethers, client, chainId),
    contract: (twContract: ThirdwebContract, abi?: ethers5.ContractInterface) =>
      contract(ethers, twContract, abi),
  };
})();

function provider(
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

function contract<abi extends ethers5.ContractInterface>(
  ethers: Ethers5,
  twContract: ThirdwebContract,
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
        return m.resolveAbi({
          chainId: twContract.chainId,
          contractAddress: twContract.address,
        }) as Promise<ethers5.ContractInterface>;
      })
      .then((abi_) => {
        // call self again this time with the resolved abi
        return contract(ethers, twContract, abi_);
      });
  }

  // @ts-expect-error - typescript can't understand this
  return new ethers.Contract(
    twContract.address,
    abi,
    provider(ethers, twContract, twContract.chainId),
  );
}
