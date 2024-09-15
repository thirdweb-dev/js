"use client";

import { thirdwebClient } from "@/constants/client";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Divider, Flex, Icon, IconButton } from "@chakra-ui/react";
import type { Abi } from "abitype";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  getContractPublisher,
  publishContract,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";
import { useLoggedInUser } from "../../../@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  useContractFullPublishMetadata,
  useEns,
  useFetchDeployMetadata,
  useFunctionParamsFromABI,
} from "../hooks";
import type { ContractId } from "../types";
import { ContractParamsFieldset } from "./contract-params-fieldset";
import { FactoryFieldset } from "./factory-fieldset";
import { LandingFieldset } from "./landing-fieldset";
import { NetworksFieldset } from "./networks-fieldset";

interface ContractPublishFormProps {
  contractId: ContractId;
}

export const ContractPublishForm: React.FC<ContractPublishFormProps> = ({
  contractId,
}) => {
  useLoggedInUser();
  const [customFactoryAbi, setCustomFactoryAbi] = useState<Abi>([]);
  const [fieldsetToShow, setFieldsetToShow] = useState<
    "landing" | "factory" | "contractParams" | "networks"
  >("landing");
  const trackEvent = useTrack();

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully published contract",
    "Failed to publish contract",
  );
  const account = useActiveAccount();
  const sendTx = useSendAndConfirmTransaction({
    gasless: {
      experimentalChainlessSupport: true,
      provider: "engine",
      relayerUrl: DASHBOARD_ENGINE_RELAYER_URL,
      relayerForwarderAddress: DASHBOARD_FORWARDER_ADDRESS,
    },
  });

  const deployMetadataResultQuery = useFetchDeployMetadata(contractId);

  const latestVersion = deployMetadataResultQuery.data?.version;

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      const versplit = latestVersion.split(".");
      return `${versplit[0]}.${versplit[1]}.${Number(versplit[2]) + 1 || 0}`;
    }
    return "1.0.0";
  }, [latestVersion]);

  const transformedQueryData = useMemo(() => {
    return {
      ...deployMetadataResultQuery.data,
      name: deployMetadataResultQuery.data?.name || "",
      changelog: "",
      version: placeholderVersion,
      displayName:
        deployMetadataResultQuery.data?.displayName ||
        deployMetadataResultQuery.data?.info?.title ||
        deployMetadataResultQuery.data?.name ||
        "",
      description:
        deployMetadataResultQuery.data?.description ||
        deployMetadataResultQuery.data?.info?.notice ||
        "",
      factoryDeploymentData: deployMetadataResultQuery.data
        ?.factoryDeploymentData || {
        factoryAddresses: {},
        implementationAddresses: {},
        implementationInitializerFunction: "initialize",
        customFactoryInput: {
          factoryFunction:
            deployMetadataResultQuery.data?.factoryDeploymentData
              ?.customFactoryInput?.factoryFunction ||
            "deployProxyByImplementation",
          customFactoryAddresses:
            deployMetadataResultQuery.data?.factoryDeploymentData
              ?.customFactoryInput?.customFactoryAddresses || {},
          params:
            deployMetadataResultQuery.data?.customFactoryInput?.params || [],
        },
      },
      constructorParams:
        deployMetadataResultQuery.data?.constructorParams || {},
      networksForDeployment: deployMetadataResultQuery.data
        ?.networksForDeployment || {
        allNetworks: true,
      },
      deployType: deployMetadataResultQuery.data?.deployType || "standard",
      customFactoryAddresses: Object.entries(
        deployMetadataResultQuery.data?.factoryDeploymentData
          ?.customFactoryInput?.customFactoryAddresses || {},
      ).map(([key, value]) => ({ key: Number(key), value })),
      defaultExtensions:
        deployMetadataResultQuery.data?.defaultExtensions || [],
      defaultModules: deployMetadataResultQuery.data?.defaultModules || [],
      extensionsParamName:
        deployMetadataResultQuery.data?.factoryDeploymentData
          ?.modularFactoryInput?.hooksParamName || "",
    };
  }, [placeholderVersion, deployMetadataResultQuery.data]);

  const form = useForm<
    FetchDeployMetadataResult & { name: string; version: string }
  >({
    defaultValues: transformedQueryData,
    // @ts-expect-error - we may have partial values to begin with and that is fine, we can overwrite them later, but the type is unhappy about it
    values: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const disableNext =
    !form.watch("version") ||
    !form.watch("displayName") ||
    !!form.getFieldState("version", form.formState).error;

  const ensQuery = useEns(account?.address);

  const ensNameOrAddress = useMemo(() => {
    return ensQuery?.data?.ensName || ensQuery.data?.address;
  }, [ensQuery.data]);

  const successRedirectUrl = useMemo(() => {
    if (!ensNameOrAddress || !deployMetadataResultQuery.data?.name) {
      return undefined;
    }
    return `/${ensNameOrAddress}/${deployMetadataResultQuery.data.name}`;
  }, [ensNameOrAddress, deployMetadataResultQuery.data?.name]);

  const isDisabled = useMemo(
    () => !successRedirectUrl || !account,
    [successRedirectUrl, account],
  );

  const fullPublishMetadata = useContractFullPublishMetadata(contractId);
  const constructorParams =
    deployMetadataResultQuery.data?.abi?.find((c) => c.type === "constructor")
      ?.inputs || [];

  const initializerParams = useFunctionParamsFromABI(
    form.watch("deployType") === "customFactory"
      ? customFactoryAbi
      : deployMetadataResultQuery.data?.abi,
    form.watch("deployType") === "customFactory"
      ? form.watch(
          "factoryDeploymentData.customFactoryInput.factoryFunction",
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

  // during loading and after success we should stay in loading state
  const isLoading = sendTx.isPending || sendTx.isSuccess;

  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <FormProvider {...form}>
      <Box w="100%">
        <Flex
          as="form"
          id="contract-release-form"
          onSubmit={form.handleSubmit((data) => {
            if (!account) {
              // no account, do nothing
              return;
            }
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
              release_id: `${ensNameOrAddress}/${deployMetadataResultQuery.data?.name}`,
            });

            const metadata = {
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
                implementationInitializerFunction:
                  data.factoryDeploymentData
                    ?.implementationInitializerFunction || "initialize",
                customFactoryInput: {
                  factoryFunction:
                    data.factoryDeploymentData?.customFactoryInput
                      ?.factoryFunction || "deployProxyByImplementation",
                  params:
                    data.factoryDeploymentData?.customFactoryInput?.params ||
                    [],
                  customFactoryAddresses:
                    addressObj ||
                    data.factoryDeploymentData?.customFactoryInput
                      ?.customFactoryAddresses,
                },
              },
            } satisfies FetchDeployMetadataResult & {
              name: string;
              version: string;
            };

            const tx = publishContract({
              account,
              contract: getContractPublisher(thirdwebClient),
              metadata,
              previousMetadata: deployMetadataResultQuery.data,
            });

            sendTx.mutate(tx, {
              onSuccess: () => {
                onSuccess();
                trackEvent({
                  category: "publish",
                  action: "click",
                  label: "success",
                  uris: contractId,
                  release_id: `${ensNameOrAddress}/${deployMetadataResultQuery.data?.name}`,
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
                console.error("*** err", err);
                onError(err);
                trackEvent({
                  category: "publish",
                  action: "click",
                  label: "error",
                  uris: contractId,
                  release_id: `${ensNameOrAddress}/${deployMetadataResultQuery.data?.name}`,
                  is_factory: data.isDeployableViaFactory,
                });
              },
            });
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
                abi={deployMetadataResultQuery.data?.abi || []}
                setCustomFactoryAbi={setCustomFactoryAbi}
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
              {!account ? (
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
                      sendTx.isSuccess
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
