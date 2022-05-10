import { contractKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useWeb3 } from "./useWeb3";
import { useSigner } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { alchemyUrlMap } from "components/app-layouts/providers";
import invariant from "tiny-invariant";
import { ChainId, SUPPORTED_CHAIN_ID } from "utils/network";

interface IRemoveContract {
  contractAddress: string;
  contractType: string;
  chainId: ChainId;
}

export function useRemoveContractMutation() {
  const signer = useSigner();
  const { address } = useWeb3();

  return useMutationWithInvalidate(
    async (data: IRemoveContract) => {
      invariant(signer, "must have an active signer");

      const { contractAddress, contractType, chainId } = data;
      const rpcUrl = alchemyUrlMap[chainId as SUPPORTED_CHAIN_ID];
      const sdk = new ThirdwebSDK(rpcUrl);
      sdk.updateSignerOrProvider(signer);

      const registry = await sdk?.deployer.getRegistry();

      if (contractType === "custom") {
        return await registry.removeCustomContract(contractAddress);
      }

      return await registry.removeContract(contractAddress);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([contractKeys.list(address)]);
      },
    },
  );
}
