import { contractKeys, networkKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useAddress, useSDK, useSigner } from "@thirdweb-dev/react";
import {
  addContractToMultiChainRegistry,
  getGaslessPolygonSDK,
} from "components/contract-components/utils";
import invariant from "tiny-invariant";

type RemoveContractParams = {
  contractAddress: string;
};

export function useRemoveContractMutation(
  chainId: number,
  registry: "old" | "new" | "none",
) {
  const sdk = useSDK();
  const walletAddress = useAddress();
  const signer = useSigner();

  return useMutationWithInvalidate(
    async (data: RemoveContractParams) => {
      if (registry === "none") {
        throw new Error(`Contract is already removed`);
      }

      invariant(
        walletAddress,
        "cannot add a contract without a wallet address",
      );
      invariant(sdk, "sdk not provided");

      const { contractAddress } = data;

      // remove from old registry
      if (registry === "old") {
        const oldRegistry = await sdk?.deployer.getRegistry();
        return await oldRegistry?.removeContract(contractAddress);
      }

      // remove from new multichain registry
      else {
        const gaslessPolygonSDK = getGaslessPolygonSDK(signer);
        return await gaslessPolygonSDK.multiChainRegistry?.removeContract({
          address: contractAddress,
          chainId,
        });
      }
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          networkKeys.multiChainRegistry,
          contractKeys.list(walletAddress),
        ]);
      },
    },
  );
}

type AddContractParams = {
  contractAddress: string;
  chainId: number;
};

export function useAddContractMutation() {
  const sdk = useSDK();
  const walletAddress = useAddress();
  const signer = useSigner();

  return useMutationWithInvalidate(
    async (data: AddContractParams) => {
      invariant(walletAddress, "cannot add a contract without an address");
      invariant(sdk, "sdk not provided");

      // add to new multichain registry
      return await addContractToMultiChainRegistry(
        {
          address: data.contractAddress,
          chainId: data.chainId,
        },
        signer,
      );
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([networkKeys.multiChainRegistry]);
      },
    },
  );
}
