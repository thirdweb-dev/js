import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  useEns,
  useFunctionParamsFromABI,
  usePublishMutation,
} from "../hooks";
import { ContractId } from "../types";
import { ContractParamsFieldset } from "./contract-params-fieldset";
import { FactoryFieldset } from "./factory-fieldset";
import { LandingFieldset } from "./landing-fieldset";
import { NetworksFieldset } from "./networks-fieldset";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Divider, Flex, Icon, IconButton } from "@chakra-ui/react";
import { defaultChains } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import {
  Abi,
  CONTRACT_ADDRESSES,
  ExtraPublishMetadataSchemaInput,
  isExtensionEnabled,
} from "@thirdweb-dev/sdk";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import { Button, Text } from "tw-components";
import { z } from "zod";

const ExtraPublishMetadataSchema = ExtraPublishMetadataSchemaInput.extend({
  customFactoryAddresses: z.array(
    z.object({
      key: z.number(),
      value: z.string(),
    }),
  ),
});

interface ContractPublishFormProps {
  contractId: ContractId;
}

export const ContractPublishForm: React.FC<ContractPublishFormProps> = ({
  contractId,
}) => {
  const [customFactoryAbi, setCustomFactoryAbi] = useState<Abi>([]);

  const configuredChains = defaultChains;
  const configuredChainsIds = configuredChains.map((c) => c.chainId);
  const [fieldsetToShow, setFieldsetToShow] = useState<
    "landing" | "factory" | "contractParams" | "networks"
  >("landing");
  const trackEvent = useTrack();

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully published contract",
    "Failed to publish contract",
  );
  const address = useAddress();
  const publishMutation = usePublishMutation();

  const publishMetadata = useContractPublishMetadataFromURI(contractId);
  const prePublishMetadata = useContractPrePublishMetadata(contractId, address);

  const latestVersion =
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .version;

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      const versplit = latestVersion.split(".");
      return `${versplit[0]}.${versplit[1]}.${Number(versplit[2]) + 1 || 0}`;
    }
    return "1.0.0";
  }, [latestVersion]);

  const transformedQueryData = useMemo(() => {
    return {
      ...prePublishMetadata.data?.latestPublishedContractMetadata
        ?.publishedMetadata,
      changelog: "",
      version: placeholderVersion,
      displayName:
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.displayName ||
        prePublishMetadata.data?.preDeployMetadata.info.title ||
        publishMetadata.data?.name ||
        "",
      description:
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
        prePublishMetadata.data?.preDeployMetadata.info.notice ||
        "",
      factoryDeploymentData: prePublishMetadata.data
        ?.latestPublishedContractMetadata?.publishedMetadata
        ?.factoryDeploymentData || {
        factoryAddresses: Object.fromEntries(
          configuredChainsIds
            .map((id) =>
              id in CONTRACT_ADDRESSES
                ? [
                    id,
                    CONTRACT_ADDRESSES[id as keyof typeof CONTRACT_ADDRESSES]
                      .twFactory,
                  ]
                : null,
            )
            .filter(Boolean) as [number, string][],
        ),
        implementationAddresses: Object.fromEntries(
          configuredChainsIds.map((id) => [id, ""]),
        ),
        implementationInitializerFunction: "initialize",
        customFactoryInput: {
          factoryFunction:
            prePublishMetadata.data?.latestPublishedContractMetadata
              ?.publishedMetadata.factoryDeploymentData?.customFactoryInput
              ?.factoryFunction || "deployProxyByImplementation",
          customFactoryAddresses:
            prePublishMetadata.data?.latestPublishedContractMetadata
              ?.publishedMetadata?.factoryDeploymentData?.customFactoryInput
              ?.customFactoryAddresses || {},
        },
      },
      constructorParams:
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata?.constructorParams || {},
      networksForDeployment: prePublishMetadata.data
        ?.latestPublishedContractMetadata?.publishedMetadata
        .networksForDeployment || {
        allNetworks: true,
      },
      deployType:
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata?.deployType || "standard",
      customFactoryAddresses: Object.entries(
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata?.factoryDeploymentData?.customFactoryInput
          ?.customFactoryAddresses || {},
      ).map(([key, value]) => ({ key: Number(key), value })),
      defaultExtensions:
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata?.defaultExtensions || [],
    };
  }, [
    configuredChainsIds,
    placeholderVersion,
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata,
    prePublishMetadata.data?.preDeployMetadata.info.notice,
    prePublishMetadata.data?.preDeployMetadata.info.title,
    publishMetadata.data?.name,
  ]);

  const form = useForm<z.input<typeof ExtraPublishMetadataSchema>>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const hasTrackedImpression = useRef<boolean>(false);
  useEffect(() => {
    if (publishMetadata.data && !hasTrackedImpression.current) {
      hasTrackedImpression.current = true;
      trackEvent({
        action: "impression",
        category: "publish",
        analytics: publishMetadata.data.analytics,
      });
    }
  }, [publishMetadata.data, trackEvent]);

  const disableNext =
    !form.watch("version") ||
    !form.watch("displayName") ||
    !!form.getFieldState("version", form.formState).error;

  const ensQuery = useEns(address);

  const ensNameOrAddress = useMemo(() => {
    return ensQuery?.data?.ensName || ensQuery.data?.address;
  }, [ensQuery.data]);

  const successRedirectUrl = useMemo(() => {
    if (!ensNameOrAddress || !publishMetadata.data?.name) {
      return undefined;
    }
    return `/${ensNameOrAddress}/${publishMetadata.data.name}`;
  }, [ensNameOrAddress, publishMetadata.data?.name]);

  const isDisabled = useMemo(
    () => !successRedirectUrl || !address,
    [successRedirectUrl, address],
  );

  const fullPublishMetadata = useContractFullPublishMetadata(contractId);
  const constructorParams = useConstructorParamsFromABI(
    publishMetadata.data?.abi,
  );

  const initializerParams = useFunctionParamsFromABI(
    form.watch("deployType") === "customFactory"
      ? customFactoryAbi
      : publishMetadata.data?.abi,
    form.watch("deployType") === "customFactory"
      ? form.watch(
          `factoryDeploymentData.customFactoryInput.factoryFunction`,
        ) ||
          fullPublishMetadata.data?.factoryDeploymentData?.customFactoryInput
            ?.factoryFunction ||
          "deployProxyByImplementation"
      : form.watch("factoryDeploymentData.implementationInitializerFunction") ||
          fullPublishMetadata.data?.factoryDeploymentData
            ?.implementationInitializerFunction ||
          "initialize",
  );

  const deployParams =
    form.watch("deployType") === "standard"
      ? constructorParams
      : initializerParams;

  const isPluginRouter = useMemo(
    () => isExtensionEnabled(publishMetadata.data?.abi as Abi, "PluginRouter"),
    [publishMetadata.data?.abi],
  );

  const isDynamicContract = useMemo(
    () =>
      isExtensionEnabled(publishMetadata.data?.abi as Abi, "DynamicContract"),
    [publishMetadata.data?.abi],
  );

  const hasExtensionsParam = useMemo(
    () =>
      constructorParams.some(
        (param) => param.name === "_extensions" || "_marketplaceV3Params",
      ),
    [constructorParams],
  );

  const shouldShowDynamicFactoryInput = useMemo(
    () => isPluginRouter || (isDynamicContract && hasExtensionsParam),
    [isPluginRouter, isDynamicContract, hasExtensionsParam],
  );

  // during loading and after success we should stay in loading state
  const isLoading = publishMutation.isLoading || publishMutation.isSuccess;

  useEffect(() => {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [fieldsetToShow]);

  return (
    <FormProvider {...form}>
      <Box w="100%">
        <Flex
          as="form"
          id="contract-release-form"
          onSubmit={form.handleSubmit((data) => {
            const addressArray =
              Object.keys(data?.customFactoryAddresses || {}).length > 0
                ? (data?.customFactoryAddresses as unknown as {
                    key: number;
                    value: string;
                  }[])
                : [];

            const addressObj = addressArray.reduce<Record<number, string>>(
              (obj, item) => {
                obj[item.key] = item.value;
                return obj;
              },
              {},
            );

            trackEvent({
              category: "publish",
              action: "click",
              label: "attempt",
              uris: contractId,
              release_id: `${ensNameOrAddress}/${publishMetadata.data?.name}`,
            });
            publishMutation.mutate(
              {
                predeployUri: contractId,
                extraMetadata: {
                  ...data,
                  networksForDeployment: {
                    allNetworks:
                      data.deployType === "customFactory"
                        ? false
                        : data.networksForDeployment?.allNetworks,
                    networksEnabled:
                      addressArray.length > 0
                        ? Object.keys(addressObj).map((val) => Number(val))
                        : data.networksForDeployment?.networksEnabled,
                  },
                  factoryDeploymentData: {
                    ...data.factoryDeploymentData,
                    implementationAddresses:
                      data.factoryDeploymentData?.implementationAddresses || {},
                    customFactoryInput: {
                      factoryFunction:
                        data.factoryDeploymentData?.customFactoryInput
                          ?.factoryFunction || "deployProxyByImplementation",
                      customFactoryAddresses:
                        addressObj ||
                        data.factoryDeploymentData?.customFactoryInput
                          ?.customFactoryAddresses,
                    },
                  },
                },
                contractName: publishMetadata.data?.name,
              },
              {
                onSuccess: () => {
                  onSuccess();
                  trackEvent({
                    category: "publish",
                    action: "click",
                    label: "success",
                    uris: contractId,
                    release_id: `${ensNameOrAddress}/${publishMetadata.data?.name}`,
                    version: data.version,
                    type: data.deployType,
                  });
                  if (successRedirectUrl) {
                    router.push(
                      successRedirectUrl,
                      undefined,
                      // reset scroll after redirect
                      { scroll: true },
                    );
                  }
                },
                onError: (err) => {
                  onError(err);
                  trackEvent({
                    category: "publish",
                    action: "click",
                    label: "error",
                    uris: contractId,
                    release_id: `${ensNameOrAddress}/${publishMetadata.data?.name}`,
                    is_factory: data.isDeployableViaFactory,
                  });
                },
              },
            );
          })}
          direction="column"
          gap={6}
        >
          {fieldsetToShow !== "landing" && (
            <Box>
              <IconButton
                w="inherit"
                variant="ghost"
                onClick={() =>
                  fieldsetToShow === "contractParams" &&
                  (form.watch("deployType") === "autoFactory" ||
                    form.watch("deployType") === "customFactory")
                    ? setFieldsetToShow("factory")
                    : fieldsetToShow === "contractParams" &&
                        form.watch("deployType") === "standard"
                      ? setFieldsetToShow("networks")
                      : setFieldsetToShow("landing")
                }
                aria-label="Back"
                icon={<Icon as={IoChevronBack} boxSize={6} />}
              >
                Back
              </IconButton>
            </Box>
          )}
          {fieldsetToShow === "landing" && (
            <LandingFieldset
              latestVersion={latestVersion}
              placeholderVersion={placeholderVersion}
            />
          )}
          {fieldsetToShow === "contractParams" && (
            <ContractParamsFieldset deployParams={deployParams} />
          )}
          {fieldsetToShow === "factory" && (
            <Flex flexDir="column" gap={24}>
              <FactoryFieldset
                abi={publishMetadata.data?.abi || []}
                setCustomFactoryAbi={setCustomFactoryAbi}
                shouldShowDynamicFactoryInput={shouldShowDynamicFactoryInput}
              />
            </Flex>
          )}
          {fieldsetToShow === "networks" && (
            <Flex flexDir="column" gap={24}>
              <NetworksFieldset fromStandard />
            </Flex>
          )}
          <Flex flexDir="column" gap={6}>
            <Divider />
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flexDir={{ base: "column", md: "row" }}
              gap={4}
            >
              {!address ? (
                <>
                  <Box />
                  <CustomConnectWallet />
                </>
              ) : fieldsetToShow === "landing" &&
                form.watch("deployType") === "standard" ? (
                <>
                  <Box />
                  <Button
                    onClick={() => setFieldsetToShow("networks")}
                    colorScheme="primary"
                    isDisabled={disableNext}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow === "landing" &&
                (form.watch("deployType") === "autoFactory" ||
                  form.watch("deployType") === "customFactory") ? (
                <>
                  <Box />
                  <Button
                    onClick={() => setFieldsetToShow("factory")}
                    colorScheme="primary"
                    isDisabled={disableNext}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow !== "contractParams" &&
                deployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("contractParams")}
                    colorScheme="primary"
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Text fontStyle="italic">
                    Publishing your contract is free, we cover all gas costs.
                  </Text>
                  <Button
                    // differentiate this from the edit button
                    key="submit-button"
                    borderRadius="md"
                    position="relative"
                    role="group"
                    colorScheme="blue"
                    isLoading={isLoading}
                    form="contract-release-form"
                    isDisabled={isDisabled}
                    loadingText={
                      publishMutation.isSuccess
                        ? "Preparing page"
                        : "Publishing contract"
                    }
                    type="submit"
                  >
                    Publish Contract
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </FormProvider>
  );
};
