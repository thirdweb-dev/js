import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { contractKeys } from "@3rdweb-sdk/react";
import { useSDK } from "@thirdweb-dev/react";
import {
  DeploySchemaForPrebuiltContractType,
  PrebuiltContractType,
} from "@thirdweb-dev/sdk/evm";
import { AnalyticsEvents } from "constants/analytics";
import posthog from "posthog-js";
import invariant from "tiny-invariant";
import { z } from "zod";

export function useDeploy<TContractType extends PrebuiltContractType>(
  contractType?: TContractType,
  contractVersion = "latest",
) {
  const sdk = useSDK();
  return useMutationWithInvalidate(
    async (
      metadata: z.input<DeploySchemaForPrebuiltContractType<TContractType>>,
    ) => {
      invariant(
        sdk,
        `[Contract:deploy] - attempting to deploy ${contractType} contract without an active sdk`,
      );
      invariant(contractType, "[Contract:deploy] - contractType is required");

      const contractAddress = await sdk.deployer.deployBuiltInContract(
        contractType,
        metadata,
        contractVersion ? contractVersion : "latest",
      );
      return { contractAddress };
    },
    {
      onSuccess: ({ contractAddress }, _variables, _options, invalidate) => {
        console.info("contract deployed with information", {
          contractAddress,
          contractType,
        });
        if (contractType) {
          posthog.capture(AnalyticsEvents.DeploymentEvents[contractType], {
            contractAddress,
          });
        }
        return invalidate([contractKeys.list()]);
      },
    },
  );
}
