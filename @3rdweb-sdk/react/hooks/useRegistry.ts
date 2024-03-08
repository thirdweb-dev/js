import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAddress, useSDK, useSigner } from "@thirdweb-dev/react";
import {
  addContractToMultiChainRegistry,
  getGaslessPolygonSDK,
} from "components/contract-components/utils";
import { useAllChainsData } from "hooks/chains/allChains";
import invariant from "tiny-invariant";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useMemo } from "react";
import { getAllMultichainRegistry } from "dashboard-extensions/common/read/getAllMultichainRegistry";
import { polygon } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { defineDashboardChain, thirdwebClient } from "lib/thirdweb-client";
import { BasicContract } from "contract-ui/types/types";

export const MULTICHAIN_REGISTRY_ADDRESS =
  "0xcdAD8FA86e18538aC207872E8ff3536501431B73";

const registryContract = getContract({
  client: thirdwebClient,
  address: MULTICHAIN_REGISTRY_ADDRESS,
  chain: defineDashboardChain(polygon.id),
});

export function useMultiChainRegContractList(walletAddress?: string) {
  return useQuery(
    ["dashboard-registry", walletAddress, "multichain-contract-list"],
    async () => {
      invariant(walletAddress, "walletAddress is required");
      const contracts = await getAllMultichainRegistry({
        contract: registryContract,
        address: walletAddress,
      });

      return contracts;
    },
    {
      enabled: !!walletAddress,
    },
  );
}

interface Options {
  onlyMainnet?: boolean;
}

export const useAllContractList = (
  walletAddress: string | undefined,
  { onlyMainnet }: Options = { onlyMainnet: false },
) => {
  const multiChainQuery = useMultiChainRegContractList(walletAddress);

  const configuredChainsRecord = useSupportedChainsRecord();
  const contractList = useMemo(() => {
    const data = multiChainQuery.data || [];

    const mainnets: BasicContract[] = [];
    const testnets: BasicContract[] = [];

    data.forEach((net) => {
      if (net.chainId in configuredChainsRecord) {
        const chainRecord = configuredChainsRecord[net.chainId];
        if (chainRecord.status !== "deprecated") {
          if (chainRecord.testnet) {
            testnets.push(net);
          } else {
            mainnets.push(net);
          }
        }
      }
    });

    mainnets.sort((a, b) => a.chainId - b.chainId);

    if (onlyMainnet) {
      return mainnets;
    }

    testnets.sort((a, b) => a.chainId - b.chainId);
    return mainnets.concat(testnets);
  }, [multiChainQuery.data, onlyMainnet, configuredChainsRecord]);

  return {
    ...multiChainQuery,
    data: contractList,
  };
};

type RemoveContractParams = {
  contractAddress: string;
  chainId: number;
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

      const { contractAddress, chainId } = data;

      const gaslessPolygonSDK = getGaslessPolygonSDK(signer);
      return await gaslessPolygonSDK.multiChainRegistry?.removeContract({
        address: contractAddress,
        chainId,
      });
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
