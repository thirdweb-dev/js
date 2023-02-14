import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { contractKeys, networkKeys } from "@3rdweb-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddress, useSDK, useSigner } from "@thirdweb-dev/react";
import {
  DeploySchemaForPrebuiltContractType,
  PrebuiltContractType,
} from "@thirdweb-dev/sdk/evm";
import {
  stepAddToRegistry,
  stepCustomChainDeploy,
  stepDeploy,
  useDeployContextModal,
} from "components/contract-components/contract-deploy-form/deploy-context-modal";
import { addContractToMultiChainRegistry } from "components/contract-components/utils";
import { AnalyticsEvents } from "constants/analytics";
import posthog from "posthog-js";
import invariant from "tiny-invariant";
import { z } from "zod";

export function useDeploy<TContractType extends PrebuiltContractType>(
  chainId?: number,
  contractType?: TContractType,
  contractVersion = "latest",
  addToDashboard = true,
  isDefaultChain = true,
) {
  const sdk = useSDK();
  const signer = useSigner();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  const deployContext = useDeployContextModal();

  return useMutationWithInvalidate(
    async (
      metadata: z.input<DeploySchemaForPrebuiltContractType<TContractType>>,
    ) => {
      invariant(
        sdk,
        `[Contract:deploy] - attempting to deploy ${contractType} contract without an active sdk`,
      );
      invariant(contractType, "[Contract:deploy] - contractType is required");

      // open the modal with the appropriate steps
      deployContext.open(
        addToDashboard
          ? [
              isDefaultChain ? stepDeploy : stepCustomChainDeploy,
              stepAddToRegistry,
            ]
          : [stepDeploy],
      );

      let contractAddress: string;

      try {
        // deploy contract
        contractAddress = await sdk.deployer.deployBuiltInContract(
          contractType,
          metadata,
          contractVersion ? contractVersion : "latest",
        );
        // advance to next step
        deployContext.nextStep();
      } catch (e) {
        // failed to deploy contract - close modal for now
        deployContext.close();
        // re-throw error
        throw e;
      }

      try {
        // let user decide if they want this or not
        if (addToDashboard) {
          // add to new multi-chain registry
          invariant(
            chainId,
            `[Contract:add-to-registry] - chainId is required`,
          );
          await addContractToMultiChainRegistry(
            {
              address: contractAddress,
              chainId,
            },
            signer,
          );
          // advance to next step
          deployContext.nextStep();
        }
      } catch (e) {
        // failed to add to dashboard - for now just close the modal
        deployContext.close();
        // not re-throwing the error, this is not technically a failure to deploy, just to add to dashboard - the contract is deployed already at this stage
      }

      // always close the modal
      deployContext.close();

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

        return Promise.all([
          invalidate([contractKeys.list()]),
          queryClient.invalidateQueries([
            networkKeys.multiChainRegistry,
            walletAddress || "",
          ]),
        ]);
      },
    },
  );
}
