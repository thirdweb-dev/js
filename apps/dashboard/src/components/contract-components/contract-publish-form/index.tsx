"use client";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Divider, Flex, IconButton } from "@chakra-ui/react";
import type { Abi } from "abitype";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { ChevronFirstIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  getContractPublisher,
  publishContract,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";
import { useEns, useFunctionParamsFromABI } from "../hooks";
import { ContractParamsFieldset } from "./contract-params-fieldset";
import { FactoryFieldset } from "./factory-fieldset";
import { ImplementationParamsFieldset } from "./impl-params-fieldset";
import { LandingFieldset } from "./landing-fieldset";
import { NetworksFieldset } from "./networks-fieldset";

export function ContractPublishForm(props: {
  publishMetadata: FetchDeployMetadataResult;
  onPublishSuccess: () => Promise<void>;
  jwt: string;
}) {
  const client = getThirdwebClient(props.jwt);
  const [customFactoryAbi, setCustomFactoryAbi] = useState<Abi>([]);
  const [fieldsetToShow, setFieldsetToShow] = useState<
    "landing" | "factory" | "contractParams" | "implParams" | "networks"
  >("landing");
  const trackEvent = useTrack();

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
      relayerUrl: DASHBOARD_ENGINE_RELAYER_URL,
      relayerForwarderAddress: DASHBOARD_FORWARDER_ADDRESS,
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
      name: props.publishMetadata.name || "",
      changelog: "",
      version: placeholderVersion,
      displayName:
        props.publishMetadata.displayName ||
        props.publishMetadata.info?.title ||
        props.publishMetadata.name ||
        "",
      description:
        props.publishMetadata.description ||
        props.publishMetadata.info?.notice ||
        "",
      factoryDeploymentData: props.publishMetadata?.factoryDeploymentData || {
        factoryAddresses: {},
        implementationAddresses: {},
        implementationInitializerFunction: "initialize",
        customFactoryInput: {
          factoryFunction:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.factoryFunction || "deployProxyByImplementation",
          customFactoryAddresses:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.customFactoryAddresses || {},
          params:
            props.publishMetadata.factoryDeploymentData?.customFactoryInput
              ?.params || [],
        },
      },
      constructorParams: props.publishMetadata.constructorParams || {},
      implConstructorParams: props.publishMetadata.implConstructorParams || {},
      networksForDeployment: props.publishMetadata?.networksForDeployment || {
        allNetworks: true,
      },
      deployType: props.publishMetadata.deployType || "standard",
      customFactoryAddresses: Object.entries(
        props.publishMetadata.factoryDeploymentData?.customFactoryInput
          ?.customFactoryAddresses || {},
      ).map(([key, value]) => ({ key: Number(key), value })),
      defaultExtensions: props.publishMetadata.defaultExtensions || [],
      defaultModules: props.publishMetadata.defaultModules || [],
      extensionsParamName:
        props.publishMetadata.factoryDeploymentData?.modularFactoryInput
          ?.hooksParamName || "",
    };
  }, [placeholderVersion, props.publishMetadata]);

  const form = useForm<
    FetchDeployMetadataResult & { name: string; version: string }
  >({
    defaultValues: transformedQueryData,
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
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <FormProvider {...form}>
      <div className="w-full">
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
              release_id: `${ensNameOrAddress}/${props.publishMetadata.name}`,
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
              contract: getContractPublisher(client),
              metadata,
              previousMetadata: props.publishMetadata,
            });

            sendTx.mutate(tx, {
              onSuccess: async () => {
                onSuccess();
                trackEvent({
                  category: "publish",
                  action: "click",
                  label: "success",
                  release_id: `${ensNameOrAddress}/${props.publishMetadata.name}`,
                  version: data.version,
                  type: data.deployType,
                });
                await props.onPublishSuccess().catch((err) => {
                  console.error("Failed to run onPublishSuccess", err);
                });
                if (successRedirectUrl) {
                  router.push(successRedirectUrl, { scroll: true });
                }
              },
              onError: (err) => {
                console.error("Failed to publish contract", err);
                onError(err);
                trackEvent({
                  category: "publish",
                  action: "click",
                  label: "error",
                  release_id: `${ensNameOrAddress}/${props.publishMetadata.name}`,
                  is_factory: data.isDeployableViaFactory,
                });
              },
            });
          })}
          direction="column"
          gap={6}
        >
          {fieldsetToShow !== "landing" && (
            <div>
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
                      : fieldsetToShow === "implParams"
                        ? setFieldsetToShow("contractParams")
                        : setFieldsetToShow("landing")
                }
                aria-label="Back"
                icon={<ChevronFirstIcon className="size-6" />}
              >
                Back
              </IconButton>
            </div>
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

          {fieldsetToShow === "implParams" && implDeployParams?.length > 0 && (
            <ImplementationParamsFieldset implParams={implDeployParams} />
          )}

          {fieldsetToShow === "factory" && (
            <Flex flexDir="column" gap={24}>
              <FactoryFieldset
                abi={props.publishMetadata.abi || []}
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
                  <CustomConnectWallet isLoggedIn={!!props.jwt} />
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
                fieldsetToShow !== "implParams" &&
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
              ) : fieldsetToShow !== "contractParams" &&
                fieldsetToShow !== "implParams" &&
                deployParams?.length === 0 &&
                implDeployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    isDisabled={disableNext}
                    onClick={() => setFieldsetToShow("implParams")}
                    colorScheme="primary"
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow === "contractParams" &&
                implDeployParams?.length > 0 ? (
                <>
                  <Box />
                  <Button
                    onClick={() => setFieldsetToShow("implParams")}
                    colorScheme="primary"
                    isDisabled={disableNext}
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
                    isLoading={isPending}
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
      </div>
    </FormProvider>
  );
}
