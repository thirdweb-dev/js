import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { contractKeys } from "@3rdweb-sdk/react";
import { useSDK } from "@thirdweb-dev/react";
import { ValidContractClass } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { z } from "zod";

export function useDeploy<TContract extends ValidContractClass>(
  contractType?: TContract["contractType"],
) {
  const sdk = useSDK();
  return useMutationWithInvalidate(
    async (metadata: z.input<TContract["schema"]["deploy"]>) => {
      invariant(
        sdk,
        `[Contract:deploy] - attempting to deploy ${contractType} contract without an active sdk`,
      );
      invariant(contractType, "[Contract:deploy] - contractType is required");
      const contractAddress = await sdk.deployer.deployContract(
        contractType,
        metadata,
      );
      return { contractAddress };
    },
    {
      onSuccess: ({ contractAddress }, _variables, _options, invalidate) => {
        console.info("contract deployed with information", {
          contractAddress,
          contractType,
        });
        // TODO BRING THIS BACK
        // posthog.capture(AnalyticsEvents.DeploymentEvents.DropContract, {
        //   contractAddress,
        // });
        return invalidate([contractKeys.list()]);
      },
    },
  );
}
