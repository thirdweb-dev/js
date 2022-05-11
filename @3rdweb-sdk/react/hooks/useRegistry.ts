import { contractKeys, networkKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { alchemyUrlMap } from "components/app-layouts/providers";
import { useMutation, useQueryClient } from "react-query";
import invariant from "tiny-invariant";
import { ChainId, SUPPORTED_CHAIN_ID } from "utils/network";

interface IRemoveContract {
  contractAddress: string;
  contractType: string;
  chainId: ChainId;
}

export function useRemoveContractMutation() {
  const signer = useSigner();
  const address = useAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: IRemoveContract) => {
      invariant(signer, "must have an active signer");

      const { contractAddress, contractType, chainId } = data;
      const rpcUrl = alchemyUrlMap[chainId as SUPPORTED_CHAIN_ID];
      const sdk = new ThirdwebSDK(rpcUrl);
      sdk.updateSignerOrProvider(signer);

      const registry = await sdk?.deployer.getRegistry();

      if (contractType === "custom") {
        const tx = await registry.removeCustomContract(contractAddress);
        return tx;
      }

      const tx = await registry.removeContract(contractAddress);
      return tx;
    },
    {
      onSuccess: (_data, _variables, _options) => {
        const { chainId } = _variables;
        return queryClient.invalidateQueries([
          ...networkKeys.chain(chainId as SUPPORTED_CHAIN_ID),
          ...contractKeys.list(address),
        ]);
      },
    },
  );
}
