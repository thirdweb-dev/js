import { ValidContractClass, ValidContractInstance } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { C } from "ts-toolbelt";
import { z } from "zod";
import { contractKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useContractMetadata<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  return useQueryWithNetwork(
    contractKeys.detail(contract?.getAddress()),
    async () => await contract?.metadata.get(),
    {
      enabled: !!contract && !!contract?.getAddress(),
    },
  );
}

export function useContractMetadataMutation<
  TContract extends ValidContractClass,
>(contract?: C.Instance<TContract>) {
  return useMutationWithInvalidate(
    async (metadata: Partial<z.input<TContract["schema"]["input"]>>) => {
      invariant(contract, "contract is required");
      invariant(contract?.metadata, "contract metadata is required");
      return await contract.metadata.update(metadata);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([contractKeys.detail(contract?.getAddress())]);
      },
    },
  );
}
