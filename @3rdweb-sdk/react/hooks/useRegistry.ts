import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddress, useSDK, useSigner } from "@thirdweb-dev/react";
import {
  addContractToMultiChainRegistry,
  getGaslessPolygonSDK,
} from "components/contract-components/utils";
import { useAllChainsData } from "hooks/chains/allChains";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import invariant from "tiny-invariant";

type RemoveContractParams = {
  contractAddress: string;
  chainId: number;
  registry: "old" | "new";
};

export function useRemoveContractMutation() {
  const walletAddress = useAddress();
  const signer = useSigner();
  const { chainIdToChainRecord } = useAllChainsData();

  const queryClient = useQueryClient();

  return useMutation(
    async (data: RemoveContractParams) => {
      invariant(
        walletAddress,
        "cannot add a contract without a wallet address",
      );
      invariant(chainIdToChainRecord, "chains not initialzed yet");
      invariant(signer, "no wallet connected");
      invariant(data.chainId, "chainId not provided");

      const { contractAddress, chainId, registry } = data;

      // remove from old registry
      if (registry === "old") {
        const chain = chainIdToChainRecord[chainId];
        if (!chain) {
          throw new Error("chain not found");
        }

        const sdk = getEVMThirdwebSDK(
          chainId,
          getDashboardChainRpc(chain),
          undefined,
          signer,
        );

        const oldRegistry = await sdk?.deployer.getRegistry();
        return await oldRegistry?.removeContract(contractAddress);
      }

      // remove from new multichain registry
      else {
        const gaslessPolygonSDK = getGaslessPolygonSDK(signer);
        return await gaslessPolygonSDK.multiChainRegistry?.removeContract({
          address: contractAddress,
          chainId: data.chainId,
        });
      }
    },
    {
      onSettled: () => {
        return queryClient.invalidateQueries(["dashboard-registry"]);
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

  const queryClient = useQueryClient();

  return useMutation(
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
      onSettled: () => {
        return queryClient.invalidateQueries(["dashboard-registry"]);
      },
    },
  );
}
