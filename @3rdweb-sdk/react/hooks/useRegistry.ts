import { contractKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import invariant from "tiny-invariant";

type RemoveContractParams = {
  contractAddress: string;
};

export function useRemoveContractMutation() {
  const sdk = useSDK();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (data: RemoveContractParams) => {
      invariant(address, "cannot add a contract without an address");
      invariant(sdk, "sdk not provided");

      const { contractAddress } = data;

      const registry = await sdk?.deployer.getRegistry();
      return await registry.removeContract(contractAddress);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([contractKeys.list(address)]);
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
