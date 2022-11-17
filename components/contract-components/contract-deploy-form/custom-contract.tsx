import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useFunctionParamsFromABI,
} from "../hooks";
import { Divider, Flex, FormControl, Input } from "@chakra-ui/react";
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
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
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

  const form = useForm<{ addToDashboard: true }>();

  const isTwFactory = isThirdwebFactory(
    selectedChain,
    fullReleaseMetadata.data?.factoryDeploymentData?.factoryAddresses,
  );

  const { register, watch, handleSubmit } = form;
  const [contractParams, _setContractParams] = useState<any[]>([]);
  const setContractParams = useCallback((idx: number, value: any) => {
    _setContractParams((prev) => {
      const newArr = [...prev];
      newArr.splice(idx, 1, value);
      return newArr;
    });
  }, []);

  const deploy = useCustomContractDeployMutation(
    ipfsHash,
    isImplementationDeploy,
  );

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  return (
    <Flex
      flexGrow={1}
      minH="full"
      gap={4}
      direction="column"
      id="custom-contract-form"
      as="form"
      onSubmit={handleSubmit((d) => {
        if (!selectedChain) {
          return;
        }
        const deployData = {
          ipfsHash,
          constructorParams: contractParams,
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
            constructorParams: contractParams,
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
      {deployParams?.length ? (
        <>
          <Flex direction="column">
            <Heading size="subtitle.md">Contract Parameters</Heading>
            <Text size="body.md">
              Parameters the contract specifies to be passed in during
              deployment.
            </Text>
          </Flex>
          {/* TODO make this part of the actual form */}
          {deployParams.map((param, idx) => {
            const contructorParams =
              fullReleaseMetadata.data?.constructorParams || {};
            const extraMetadataParam = contructorParams[param.name];

            return (
              <FormControl isRequired key={param.name}>
                <Flex alignItems="center" my={1}>
                  <FormLabel mb={0} flex="1" display="flex">
                    {extraMetadataParam?.displayName ? (
                      <Flex alignItems="center" gap={1}>
                        {extraMetadataParam?.displayName}
                        <Text size="label.sm">({param.name})</Text>
                      </Flex>
                    ) : (
                      param.name
                    )}
                  </FormLabel>
                  <FormHelperText mt={0}>{param.type}</FormHelperText>
                </Flex>
                <Input
                  fontFamily={
                    param.type === "address" ? "monospace" : undefined
                  }
                  value={contractParams[idx] || ""}
                  onChange={(e) =>
                    setContractParams(idx, e.currentTarget.value)
                  }
                  type="text"
                />
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
      ) : null}
      <Flex direction="column">
        <Heading size="subtitle.md">Network / Chain</Heading>
        <Text size="body.md">
          Select a network to deploy this contract on. We recommend starting
          with a testnet.{" "}
          <TrackedLink
            href="https://blog.thirdweb.com/guides/which-network-should-you-use"
            color="primary.500"
            category="deploy"
            label="learn-networks"
            isExternal
          >
            Learn more about the different networks.
          </TrackedLink>
        </Text>
      </Flex>
      <Flex alignItems="center" gap={3}>
        {!isTwFactory && (
          <Checkbox {...register("addToDashboard")} defaultChecked />
        )}
        <Text mt={1}>
          Add to dashboard so I can find it in the list of my contracts at{" "}
          <TrackedLink
            href="https://thirdweb.com/dashboard"
            isExternal
            category="custom-contract"
            label="visit-dashboard"
            color="primary.500"
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
          colorScheme="primary"
          transactionCount={isTwFactory ? 1 : !watch("addToDashboard") ? 1 : 2}
        >
          Deploy Now
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default CustomContractForm;
