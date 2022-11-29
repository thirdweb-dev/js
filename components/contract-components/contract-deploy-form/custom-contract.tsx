import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useEns,
  useFunctionParamsFromABI,
} from "../hooks";
import { Divider, Flex, FormControl, Input } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  ContractType,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  getContractAddressByChainId,
} from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { DisabledChainsMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/tempalte-values";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Checkbox,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { SupportedChainIdToNetworkMap } from "utils/network";

function isThirdwebFactory(
  chainId: SUPPORTED_CHAIN_ID | undefined,
  factoryAddressMap: Record<string, string> = {},
) {
  if (!chainId) {
    return false;
  }
  const factoryAddress =
    chainId in factoryAddressMap ? factoryAddressMap[chainId] : "";
  const chainFactoryAddress = getContractAddressByChainId(chainId, "twFactory");
  return chainFactoryAddress === factoryAddress;
}

interface CustomContractFormProps {
  ipfsHash: string;
  selectedChain: SUPPORTED_CHAIN_ID | undefined;
  onChainSelect: (chainId: SUPPORTED_CHAIN_ID) => void;
  isImplementationDeploy?: boolean;
  onSuccessCallback?: (contractAddress: string) => void;
}

const CustomContractForm: React.FC<CustomContractFormProps> = ({
  ipfsHash,
  selectedChain,
  onChainSelect,
  isImplementationDeploy,
  onSuccessCallback,
}) => {
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
    fullReleaseMetadata.data?.isDeployableViaFactory ||
    (fullReleaseMetadata.data?.isDeployableViaProxy && !isImplementationDeploy);

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

  const isTwFactory =
    (fullReleaseMetadata.data?.isDeployableViaFactory ||
      fullReleaseMetadata.data?.isDeployableViaProxy) &&
    isThirdwebFactory(
      selectedChain,
      fullReleaseMetadata.data?.factoryDeploymentData?.factoryAddresses,
    );

  const form = useForm<{
    addToDashboard: boolean;
    deployParams: Record<string, string>;
  }>({
    defaultValues: {
      addToDashboard: !isTwFactory,
      deployParams: deployParams.reduce((acc, param) => {
        acc[param.name] = replaceTemplateValues(
          fullReleaseMetadata.data?.constructorParams?.[param.name]
            .defaultValue || "",
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
      addToDashboard: !isTwFactory,
      deployParams: deployParams.reduce((acc, param) => {
        acc[param.name] = replaceTemplateValues(
          fullReleaseMetadata.data?.constructorParams?.[param.name]
            .defaultValue || "",
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
        const addToDashboard = isTwFactory ? false : d.addToDashboard;
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
              });
              trackEvent({
                category: "custom-contract",
                action: "add-to-dashboard",
                label: "success",
                contractAddress: deployedContractAddress,
              });
              onSuccess();
              if (onSuccessCallback) {
                onSuccessCallback(deployedContractAddress);
              } else {
                router.replace(
                  `/${SupportedChainIdToNetworkMap[selectedChain]}/${deployedContractAddress}`,
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
              <FormControl isRequired key={paramKey}>
                <Flex alignItems="center" my={1}>
                  <FormLabel mb={0} flex="1" display="flex">
                    {extraMetadataParam?.displayName ? (
                      <Flex alignItems="center" gap={1}>
                        {extraMetadataParam?.displayName}
                        <Text size="label.sm">({paramKey})</Text>
                      </Flex>
                    ) : (
                      paramKey
                    )}
                  </FormLabel>
                  {deployParam && (
                    <FormHelperText mt={0}>{deployParam.type}</FormHelperText>
                  )}
                </Flex>
                <Input {...form.register(`deployParams.${paramKey}`)} />
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
      {!isTwFactory && (
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
      )}
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
            onChange={(e) =>
              onChainSelect(
                parseInt(e.currentTarget.value) as SUPPORTED_CHAIN_ID,
              )
            }
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
          transactionCount={
            isTwFactory ? 1 : !form.watch("addToDashboard") ? 1 : 2
          }
        >
          Deploy Now
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default CustomContractForm;
