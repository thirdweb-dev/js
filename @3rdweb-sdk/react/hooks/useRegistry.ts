import { contractKeys, networkKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddress, useSDK, useSigner } from "@thirdweb-dev/react";
import { ChainId, SUPPORTED_CHAIN_ID, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { alchemyUrlMap } from "components/app-layouts/providers";
import invariant from "tiny-invariant";

type RemoveContractParams = {
  contractAddress: string;
  contractType: string;
  chainId: ChainId;
};
export function useRemoveContractMutation() {
  const signer = useSigner();
  const address = useAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: RemoveContractParams) => {
      invariant(signer, "must have an active signer");

      const { contractAddress, chainId } = data;
      const rpcUrl = alchemyUrlMap[chainId as SUPPORTED_CHAIN_ID];
      const sdk = ThirdwebSDK.fromSigner(signer, rpcUrl);

      const registry = await sdk?.deployer.getRegistry();
      const tx = await registry.removeContract(contractAddress);
      return tx;
    },
    {
      onSuccess: (_data, _variables) => {
        const { chainId } = _variables;
        return queryClient.invalidateQueries([
          ...networkKeys.chain(chainId as SUPPORTED_CHAIN_ID),
          ...contractKeys.list(address),
        ]);
      },
    },
  );
}

type AddContractParams = {
  contractAddress: string;
};

export function useAddContractMutation() {
  const sdk = useSDK();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (data: AddContractParams) => {
      invariant(address, "cannot add a contract without an address");
      invariant(sdk, "sdk not provided");

      const { contractAddress } = data;

      const registry = await sdk.deployer.getRegistry();
      return await registry.addContract(contractAddress);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([contractKeys.list(address)]);
      },
    },
  );
}
