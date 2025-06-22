"use client";
import { Box, Divider, Flex, IconButton } from "@chakra-ui/react";
import type { Abi } from "abitype";
import { Button } from "chakra/button";
import { Text } from "chakra/text";
import { ChevronFirstIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  getContractPublisher,
  publishContract,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { reportContractPublished } from "@/analytics/report";
import { CustomConnectWallet } from "@/components/connect-wallet";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "@/constants/misc";
import { useEns, useFunctionParamsFromABI } from "@/hooks/contract-hooks";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { ContractParamsFieldset } from "./contract-params-fieldset";
import { FactoryFieldset } from "./factory-fieldset";
import { ImplementationParamsFieldset } from "./impl-params-fieldset";
import { LandingFieldset } from "./landing-fieldset";
import { NetworksFieldset } from "./networks-fieldset";

export function ContractPublishForm(props: {
  publishMetadata: FetchDeployMetadataResult;
  onPublishSuccess: () => Promise<void>;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const [customFactoryAbi, setCustomFactoryAbi] = useState<Abi>([]);
  const [fieldsetToShow, setFieldsetToShow] = useState<
    "landing" | "factory" | "contractParams" | "implParams" | "networks"
  >("landing");

  const router = useDashboardRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully published contract",
    "Failed to publish contract",
  );
  const account = useActiveAccount();
  const sendTx = useSendAndConfirmTransaction({
    gasless: {
      experimentalChainlessSupport: true,
      provider: "engine",
      relayerForwarderAddress: DASHBOARD_FORWARDER_ADDRESS,
      relayerUrl: DASHBOARD_ENGINE_RELAYER_URL,
    },
  });

  const latestVersion = props.publishMetadata.version;

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      const versionSplit = latestVersion.split(".");
      return `${versionSplit[0]}.${versionSplit[1]}.${Number(versionSplit[2]) + 1 || 0}`;
    }
    return "1.0.0";
  }, [latestVersion]);

  const transformedQueryData = useMemo(() => {
    return {
      ...props.publishMetadata,
      changelog: "",
      constructorParams: props.publishMetadata.constructorParams || {},
      customFactoryAddresses: Object.entries(
        props.publishMetadata.factoryDeploymentData?.customFactoryInput
          ?.customFactoryAddresses || {},
      ).map(([key, value]) => ({ key: Number(key), value })),
      defaultExtensions: props.publishMetadata.defaultExtensions || [],
      defaultModules: props.publishMetadata.defaultModules || [],
      deployType: props.publishMetadata.deployType || "standard",
      description:
        props.publishMetadata.description ||
        props.publishMetadata.info?.notice ||
        "",
      displayName:
        props.publishMetadata.displayName ||
        props.publishMetadata.info?.title ||
        props.publishMetadata.name ||
        "",
      extensionsParamName:
        props.publishMetadata.factoryDeploymentData?.modularFactoryInput
          ?.hooksParamName || "",
      factoryDeploymentData: props.publishMetadata?.factoryDeploymentData || {
        customFactoryInput: {
          customFactoryAddresses:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.customFactoryAddresses || {},
          factoryFunction:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.factoryFunction || "deployProxyByImplementation",
          params:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.params || [],
        },
        factoryAddresses: {},
        implementationAddresses: {},
        implementationInitializerFunction: "initialize",
      },
      implConstructorParams: props.publishMetadata.implConstructorParams || {},
      name: props.publishMetadata.name || "",
      networksForDeployment: props.publishMetadata?.networksForDeployment || {
        allNetworks: true,
      },
      version: placeholderVersion,
    };
  }, [placeholderVersion, props.publishMetadata]);

  const form = useForm<
    FetchDeployMetadataResult & { name: string; version: string }
  >({
    defaultValues: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
    values: transformedQueryData,
  });

  const disableNext =
    !form.watch("version") ||
    !form.watch("displayName") ||
    !!form.getFieldState("version", form.formState).error;

  const ensQuery = useEns({
    addressOrEnsName: account?.address,
    client: props.client,
  });

  const ensNameOrAddress = useMemo(() => {
    return ensQuery?.data?.ensName || ensQuery.data?.address;
  }, [ensQuery.data]);

  const successRedirectUrl = useMemo(() => {
    if (!ensNameOrAddress || !props.publishMetadata.name) {
      return undefined;
    }
    return `/${ensNameOrAddress}/${props.publishMetadata.name}`;
  }, [ensNameOrAddress, props.publishMetadata.name]);

  const isDisabled = useMemo(
    () => !successRedirectUrl || !account,
    [successRedirectUrl, account],
  );

  const constructorParams =
    props.publishMetadata.abi.find((c) => c.type === "constructor")?.inputs ||
    [];

  const initializerParams = useFunctionParamsFromABI(
    form.watch("deployType") === "customFactory"
      ? customFactoryAbi
      : props.publishMetadata.abi,
    form.watch("deployType") === "customFactory"
      ? form.watch(
          "factoryDeploymentData.customFactoryInput.factoryFunction",
        ) ||
          props.publishMetadata.factoryDeploymentData?.customFactoryInput
            ?.factoryFunction ||
          "deployProxyByImplementation"
      : form.watch("factoryDeploymentData.implementationInitializerFunction") ||
          props.publishMetadata.factoryDeploymentData
            ?.implementationInitializerFunction ||
          "initialize",
  );

  const deployParams =
    form.watch("deployType") === "standard"
      ? constructorParams
      : initializerParams;

  const implDeployParams =
    form.watch("deployType") === "autoFactory" ? constructorParams : [];

  // during loading and after success we should stay in loading state
  const isPending = sendTx.isPending || sendTx.isSuccess;

  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  const formId = useId();

  return (
    <FormProvider {...form}>
      <div className="w-full">
        <Flex
          as="form"
          direction="column"
          gap={6}
          id={formId}
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

            const metadata = {
              ...data,
              factoryDeploymentData: {
                ...data.factoryDeploymentData,
                customFactoryInput: {
                  customFactoryAddresses:
                    addressObj ||
                    data.factoryDeploymentData?.customFactoryInput
                      ?.customFactoryAddresses,
                  factoryFunction:
                    data.factoryDeploymentData?.customFactoryInput
                      ?.factoryFunction || "deployProxyByImplementation",
                  params:
                    data.factoryDeploymentData?.customFactoryInput?.params ||
                    [],
                },
                implementationAddresses:
                  data.factoryDeploymentData?.implementationAddresses || {},
                implementationInitializerFunction:
                  data.factoryDeploymentData
                    ?.implementationInitializerFunction || "initialize",
              },
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
            } satisfies FetchDeployMetadataResult & {
              name: string;
              version: string;
            };

            const tx = publishContract({
              account,
              contract: getContractPublisher(props.client),
              metadata,
              previousMetadata: props.publishMetadata,
            });

            sendTx.mutate(tx, {
              onError: (err) => {
                console.error("Failed to publish contract", err);
                onError(err);
              },
              onSuccess: async () => {
                onSuccess();

                reportContractPublished({
                  contractName: props.publishMetadata.name,
                  deployType: data.deployType,
                  publisher: ensNameOrAddress ?? "",
                  version: data.version,
                });
                await props.onPublishSuccess().catch((err) => {
                  console.error("Failed to run onPublishSuccess", err);
                });
                if (successRedirectUrl) {
                  router.push(successRedirectUrl, { scroll: true });
                }
              },
            });
          })}
        >
          {fieldsetToShow !== "landing" && (
            <div>
              <IconButton
                aria-label="Back"
                icon={<ChevronFirstIcon className="size-6" />}
                onClick={() =>
                  fieldsetToShow === "contractParams" &&
                  (form.watch("deployType") === "autoFactory" ||
                    form.watch("deployType") === "customFactory")
                    ? setFieldsetToShow("factory")
                    : fieldsetToShow === "contractParams" &&
                        form.watch("deployType") === "standard"
                      ? setFieldsetToShow("networks")
                      : fieldsetToShow === "implParams"
                        ? setFieldsetToShow("contractParams")
                        : setFieldsetToShow("landing")
                }
                variant="ghost"
                w="inherit"
              >
                Back
              </IconButton>
            </div>
          )}

          {fieldsetToShow === "landing" && (
            <LandingFieldset
              client={props.client}
              latestVersion={latestVersion}
              placeholderVersion={placeholderVersion}
            />
          )}

          {fieldsetToShow === "contractParams" && (
            <ContractParamsFieldset
              client={props.client}
              deployParams={deployParams}
            />
          )}

          {fieldsetToShow === "implParams" && implDeployParams?.length > 0 && (
            <ImplementationParamsFieldset
              client={props.client}
              implParams={implDeployParams}
            />
          )}

          {fieldsetToShow === "factory" && (
            <Flex flexDir="column" gap={24}>
              <FactoryFieldset
                abi={props.publishMetadata.abi || []}
                client={props.client}
                setCustomFactoryAbi={setCustomFactoryAbi}
              />
            </Flex>
          )}

          {fieldsetToShow === "networks" && (
            <Flex flexDir="column" gap={24}>
              <NetworksFieldset client={props.client} fromStandard />
            </Flex>
          )}

          <Flex flexDir="column" gap={6}>
            <Divider />
            <Flex
              alignItems="center"
              flexDir={{ base: "column", md: "row" }}
              gap={4}
              justifyContent="space-between"
            >
              {!account ? (
                <>
                  <Box />
                  <CustomConnectWallet
                    client={props.client}
                    isLoggedIn={props.isLoggedIn}
                  />
                </>
              ) : fieldsetToShow === "landing" &&
                form.watch("deployType") === "standard" ? (
                <>
                  <Box />
                  <Button
                    colorScheme="primary"
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("networks")}
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
                    colorScheme="primary"
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("factory")}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow !== "contractParams" &&
                fieldsetToShow !== "implParams" &&
                deployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    colorScheme="primary"
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("contractParams")}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow !== "contractParams" &&
                fieldsetToShow !== "implParams" &&
                deployParams?.length === 0 &&
                implDeployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    colorScheme="primary"
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("implParams")}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow === "contractParams" &&
                implDeployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    colorScheme="primary"
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("implParams")}
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
                    borderRadius="md"
                    colorScheme="blue"
                    form={formId}
                    isDisabled={isDisabled}
                    isLoading={isPending}
                    key="submit-button"
                    loadingText={
                      sendTx.isSuccess
                        ? "Preparing page"
                        : "Publishing contract"
                    }
                    position="relative"
                    type="submit"
                  >
                    Publish Contract
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </div>
    </FormProvider>
  );
}
