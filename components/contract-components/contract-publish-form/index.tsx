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
import { ProxyFieldset } from "./proxy-fieldset";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Divider, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  CONTRACT_ADDRESSES,
  ExtraPublishMetadata,
} from "@thirdweb-dev/sdk/evm";
import { useTrack } from "hooks/analytics/useTrack";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import { Button, Text } from "tw-components";

interface ContractPublishFormProps {
  contractId: ContractId;
}

export const ContractPublishForm: React.FC<ContractPublishFormProps> = ({
  contractId,
}) => {
  const configuredChains = useConfiguredChains();
  const configuredChainsIds = configuredChains.map((c) => c.chainId);
  const [contractSelection, setContractSelection] = useState<
    "standard" | "proxy" | "factory"
  >("standard");
  const [fieldsetToShow, setFieldsetToShow] = useState<
    "landing" | "proxy" | "factory" | "contractParams"
  >("landing");
  const trackEvent = useTrack();

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully published contract",
    "Failed to publish contract",
  );
  const address = useAddress();
  const publishMutation = usePublishMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const publishMetadata = useContractPublishMetadataFromURI(contractId);
  const prePublishMetadata = useContractPrePublishMetadata(contractId, address);

  const latestVersion =
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .version;

  const form = useForm<ExtraPublishMetadata>();

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      const versplit = latestVersion.split(".");
      return `${versplit[0]}.${versplit[1]}.${Number(versplit[2]) + 1 || 0}`;
    }
    return "1.0.0";
  }, [latestVersion]);

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

  useEffect(() => {
    if (address) {
      form.reset(
        {
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
                        CONTRACT_ADDRESSES[
                          id as keyof typeof CONTRACT_ADDRESSES
                        ].twFactory,
                      ]
                    : null,
                )
                .filter(Boolean) as [number, string][],
            ),
            implementationAddresses: Object.fromEntries(
              configuredChainsIds.map((id) => [id, ""]),
            ),
            implementationInitializerFunction: "initialize",
          },
          constructorParams:
            prePublishMetadata.data?.latestPublishedContractMetadata
              ?.publishedMetadata?.constructorParams || {},
        },
        { keepDirtyValues: true },
      );

      if (
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.isDeployableViaFactory
      ) {
        setContractSelection("factory");
      } else if (
        prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.isDeployableViaProxy
      ) {
        setContractSelection("proxy");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    prePublishMetadata.data,
    address,
    placeholderVersion,
    form.formState.isDirty,
  ]);

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
    publishMetadata.data?.abi,
    fullPublishMetadata.data?.factoryDeploymentData
      ?.implementationInitializerFunction || "initialize",
  );

  const deployParams =
    contractSelection === "proxy" || contractSelection === "factory"
      ? initializerParams
      : constructorParams;

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
            // the drawer has another form inside it which triggers this one on submit
            // hacky solution to avoid double submission
            if (isDrawerOpen) {
              return;
            }
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
                  isDeployableViaFactory: contractSelection === "factory",
                  isDeployableViaProxy: contractSelection === "proxy",
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
                    type: data.isDeployableViaProxy
                      ? "proxy"
                      : data.isDeployableViaFactory
                      ? "factory"
                      : "standard",
                    is_proxy: data.isDeployableViaProxy,
                    is_factory: data.isDeployableViaFactory,
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
                    is_proxy: data.isDeployableViaProxy,
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
                  contractSelection === "proxy"
                    ? setFieldsetToShow("proxy")
                    : fieldsetToShow === "contractParams" &&
                      contractSelection === "factory"
                    ? setFieldsetToShow("factory")
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
              contractSelection={contractSelection}
              setContractSelection={setContractSelection}
              latestVersion={latestVersion}
              placeholderVersion={placeholderVersion}
            />
          )}
          {fieldsetToShow === "contractParams" && (
            <ContractParamsFieldset deployParams={deployParams} />
          )}
          {fieldsetToShow === "proxy" && (
            <ProxyFieldset
              setIsDrawerOpen={setIsDrawerOpen}
              contractId={contractId}
            />
          )}
          {fieldsetToShow === "factory" && (
            <Flex flexDir="column" gap={24}>
              <ProxyFieldset
                setIsDrawerOpen={setIsDrawerOpen}
                contractId={contractId}
              />
              <FactoryFieldset />
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
                  <ConnectWallet />
                </>
              ) : fieldsetToShow === "landing" &&
                contractSelection === "proxy" ? (
                <>
                  <Box />
                  <Button
                    onClick={() => setFieldsetToShow("proxy")}
                    colorScheme="primary"
                    isDisabled={disableNext}
                  >
                    Next
                  </Button>
                </>
              ) : fieldsetToShow === "landing" &&
                contractSelection === "factory" ? (
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
