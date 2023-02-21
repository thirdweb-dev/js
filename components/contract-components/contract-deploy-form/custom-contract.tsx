import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useEns,
  useFunctionParamsFromABI,
} from "../hooks";
import { ConfigureNetworkButton } from "../shared/configure-network-button";
import { Divider, Flex, FormControl } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ContractType, SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { DisabledChainsMap } from "constants/mappings";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { useTrack } from "hooks/analytics/useTrack";
import { useConfiguredChain } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import {
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";

interface CustomContractFormProps {
  ipfsHash: string;
  selectedChain: number | undefined;
  onChainSelect: (chainId: number) => void;
  isImplementationDeploy?: true;
  onSuccessCallback?: (contractAddress: string) => void;
}

const CustomContractForm: React.FC<CustomContractFormProps> = ({
  ipfsHash,
  selectedChain,
  onChainSelect,
  isImplementationDeploy,
  onSuccessCallback,
}) => {
  const networkInfo = useConfiguredChain(selectedChain || -1);
  const address = useAddress();
  const ensQuery = useEns(address);
  const trackEvent = useTrack();
  const compilerMetadata = useContractPublishMetadataFromURI(ipfsHash);
  const fullReleaseMetadata = useContractFullPublishMetadata(ipfsHash);
  const constructorParams = useConstructorParamsFromABI(
    compilerMetadata.data?.abi,
  );
  const initializerParams = useFunctionParamsFromABI(
    compilerMetadata.data?.abi,
    fullReleaseMetadata.data?.factoryDeploymentData
      ?.implementationInitializerFunction || "initialize",
  );
  const isFactoryDeployment =
    (fullReleaseMetadata.data?.isDeployableViaFactory ||
      fullReleaseMetadata.data?.isDeployableViaProxy) &&
    !isImplementationDeploy;

  const deployParams = isFactoryDeployment
    ? initializerParams
    : constructorParams;

  const disabledChains =
    isFactoryDeployment && fullReleaseMetadata.data?.factoryDeploymentData
      ? SUPPORTED_CHAIN_IDS.filter((chain) => {
          const implementationAddress =
            fullReleaseMetadata.data?.factoryDeploymentData
              ?.implementationAddresses?.[chain];
          return (
            !implementationAddress ||
            (implementationAddress && implementationAddress.length === 0)
          );
        })
      : undefined;

  const form = useForm<{
    addToDashboard: boolean;
    deployParams: Record<string, string>;
  }>({
    defaultValues: {
      addToDashboard: true,
      deployParams: deployParams.reduce((acc, param) => {
        acc[param.name] = replaceTemplateValues(
          fullReleaseMetadata.data?.constructorParams?.[param.name]
            ?.defaultValue || "",
          param.type,
          {
            connectedWallet: address,
            chainId: selectedChain,
          },
        );
        return acc;
      }, {} as Record<string, string>),
    },
    values: {
      addToDashboard: true,
      deployParams: deployParams.reduce((acc, param) => {
        acc[param.name] = replaceTemplateValues(
          fullReleaseMetadata.data?.constructorParams?.[param.name]
            ?.defaultValue || "",
          param.type,
          {
            connectedWallet: address,
            chainId: selectedChain,
          },
        );
        return acc;
      }, {} as Record<string, string>),
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const deploy = useCustomContractDeployMutation(
    ipfsHash,
    isImplementationDeploy,
  );

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  const formDeployParams = form.watch("deployParams");

  return (
    <FormProvider {...form}>
      <Flex
        flexGrow={1}
        minH="full"
        gap={4}
        direction="column"
        id="custom-contract-form"
        as="form"
        onSubmit={form.handleSubmit((d) => {
          if (!selectedChain) {
            return;
          }
          const deployData = {
            ipfsHash,
            constructorParams: d.deployParams,
            contractMetadata: d,
            publishMetadata: compilerMetadata.data,
            chainId: selectedChain,
            is_proxy: fullReleaseMetadata.data?.isDeployableViaProxy,
            is_factory: fullReleaseMetadata.data?.isDeployableViaProxy,
          };
          // always respect this since even factory deployments cannot auto-add to registry anymore
          const addToDashboard = d.addToDashboard;
          trackEvent({
            category: "custom-contract",
            action: "deploy",
            label: "attempt",
            deployData,
          });
          deploy.mutate(
            {
              constructorParams: Object.values(d.deployParams),
              addToDashboard,
            },
            {
              onSuccess: (deployedContractAddress) => {
                console.info("contract deployed:", {
                  chainId: selectedChain,
                  address: deployedContractAddress,
                });
                trackEvent({
                  category: "custom-contract",
                  action: "deploy",
                  label: "success",
                  deployData,
                  contractAddress: deployedContractAddress,
                  addToDashboard,
                  deployer: ensQuery.data?.ensName || address,
                  contractName: compilerMetadata.data?.name,
                  deployerAndContractName: `${
                    ensQuery.data?.ensName || address
                  }__${compilerMetadata.data?.name}`,
                  releaseAsPath: router.asPath,
                });
                trackEvent({
                  category: "custom-contract",
                  action: "add-to-dashboard",
                  label: "success",
                  contractAddress: deployedContractAddress,
                });
                onSuccess();
                if (onSuccessCallback) {
                  onSuccessCallback(deployedContractAddress || "");
                } else {
                  invariant(
                    networkInfo,
                    `Network not found for chainId ${selectedChain}`,
                  );
                  router.replace(
                    `/${networkInfo.slug}/${deployedContractAddress}`,
                  );
                }
              },
              onError: (err) => {
                trackEvent({
                  category: "custom-contract",
                  action: "deploy",
                  label: "error",
                  deployData,
                  error: err,
                });
                onError(err);
              },
            },
          );
        })}
      >
        {Object.keys(formDeployParams).length > 0 && (
          <>
            <Flex direction="column">
              <Heading size="subtitle.md">Contract Parameters</Heading>
              <Text size="body.md">
                Parameters the contract specifies to be passed in during
                deployment.
              </Text>
            </Flex>
            {Object.keys(formDeployParams).map((paramKey) => {
              const deployParam = deployParams.find((p) => p.name === paramKey);
              const contructorParams =
                fullReleaseMetadata.data?.constructorParams || {};
              const extraMetadataParam = contructorParams[paramKey];
              return (
                <FormControl
                  isRequired
                  key={paramKey}
                  isInvalid={
                    !!form.getFieldState(
                      `deployParams.${paramKey}`,
                      form.formState,
                    ).error
                  }
                >
                  <Flex alignItems="center" my={1}>
                    <FormLabel mb={0} flex="1" display="flex">
                      <Flex alignItems="baseline" gap={1}>
                        {extraMetadataParam?.displayName ||
                          camelToTitle(paramKey)}
                        <Text size="label.sm">({paramKey})</Text>
                      </Flex>
                    </FormLabel>
                    {deployParam && (
                      <FormHelperText mt={0}>{deployParam.type}</FormHelperText>
                    )}
                  </Flex>
                  {deployParam && (
                    <SolidityInput
                      defaultValue={form.watch(`deployParams.${paramKey}`)}
                      solidityType={deployParam.type}
                      {...form.register(`deployParams.${paramKey}`)}
                    />
                  )}
                  <FormErrorMessage>
                    {
                      form.getFieldState(
                        `deployParams.${paramKey}`,
                        form.formState,
                      ).error?.message
                    }
                  </FormErrorMessage>
                  {extraMetadataParam?.description && (
                    <FormHelperText>
                      {extraMetadataParam?.description}
                    </FormHelperText>
                  )}
                </FormControl>
              );
            })}
            <Divider mt="auto" />
          </>
        )}

        <Flex direction="column">
          <Heading size="subtitle.md">Network / Chain</Heading>
          <Text size="body.md">
            Select a network to deploy this contract on. We recommend starting
            with a testnet.{" "}
            <TrackedLink
              href="https://blog.thirdweb.com/guides/which-network-should-you-use"
              color="blue.500"
              category="deploy"
              label="learn-networks"
              isExternal
            >
              Learn more about the different networks.
            </TrackedLink>
          </Text>
        </Flex>

        <Flex alignItems="center" gap={3}>
          <Checkbox {...form.register("addToDashboard")} defaultChecked />

          <Text mt={1}>
            Add to dashboard so I can find it in the list of my contracts at{" "}
            <TrackedLink
              href="https://thirdweb.com/dashboard"
              isExternal
              category="custom-contract"
              label="visit-dashboard"
              color="blue.500"
            >
              /dashboard
            </TrackedLink>
            .
          </Text>
        </Flex>

        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <FormControl>
            <SupportedNetworkSelect
              disabledChainIds={DisabledChainsMap[
                "custom" as ContractType
              ].concat(disabledChains || [])}
              isDisabled={
                isImplementationDeploy ||
                deploy.isLoading ||
                !compilerMetadata.isSuccess
              }
              value={
                !DisabledChainsMap["custom" as ContractType].find(
                  (chain) => chain === selectedChain,
                )
                  ? selectedChain
                  : -1
              }
              onChange={(e) => onChainSelect(parseInt(e.currentTarget.value))}
            />
          </FormControl>
          <TransactionButton
            flexShrink={0}
            type="submit"
            form="custom-contract-form"
            isLoading={deploy.isLoading}
            isDisabled={
              !compilerMetadata.isSuccess ||
              !selectedChain ||
              !!disabledChains?.find((chain) => chain === selectedChain)
            }
            colorScheme="blue"
            transactionCount={form.watch("addToDashboard") ? 2 : 1}
          >
            Deploy Now
          </TransactionButton>
        </Flex>

        <ConfigureNetworkButton label="deploy-contract" />
      </Flex>
    </FormProvider>
  );
};

export default CustomContractForm;
