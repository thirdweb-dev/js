"use client";
import type { Abi } from "abitype";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "@/constants/misc";
import { useEns, useFunctionParamsFromABI } from "@/hooks/contract-hooks";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { useDashboardRouter } from "@/lib/DashboardRouter";
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

  const formId = useId();

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6"
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
                  data.factoryDeploymentData?.customFactoryInput?.params || [],
              },
              implementationAddresses:
                data.factoryDeploymentData?.implementationAddresses || {},
              implementationInitializerFunction:
                data.factoryDeploymentData?.implementationInitializerFunction ||
                "initialize",
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
            <Button
              size="sm"
              className="-translate-x-3"
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
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Button>
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
          <div className="flex flex-col gap-24">
            <FactoryFieldset
              abi={props.publishMetadata.abi || []}
              client={props.client}
              setCustomFactoryAbi={setCustomFactoryAbi}
            />
          </div>
        )}

        {fieldsetToShow === "networks" && (
          <NetworksFieldset client={props.client} />
        )}

        <div className="flex items-center gap-4 justify-end border-t py-6 mt-6">
          {!account ? (
            <CustomConnectWallet
              client={props.client}
              isLoggedIn={props.isLoggedIn}
            />
          ) : fieldsetToShow === "landing" &&
            form.watch("deployType") === "standard" ? (
            <NextButton
              disabled={disableNext}
              onClick={() => setFieldsetToShow("networks")}
            />
          ) : fieldsetToShow === "landing" &&
            (form.watch("deployType") === "autoFactory" ||
              form.watch("deployType") === "customFactory") ? (
            <NextButton
              disabled={disableNext}
              onClick={() => setFieldsetToShow("factory")}
            />
          ) : fieldsetToShow !== "contractParams" &&
            fieldsetToShow !== "implParams" &&
            deployParams?.length > 0 ? (
            <NextButton
              disabled={disableNext}
              onClick={() => setFieldsetToShow("contractParams")}
            />
          ) : fieldsetToShow !== "contractParams" &&
            fieldsetToShow !== "implParams" &&
            deployParams?.length === 0 &&
            implDeployParams?.length > 0 ? (
            <NextButton
              disabled={disableNext}
              onClick={() => setFieldsetToShow("implParams")}
            />
          ) : fieldsetToShow === "contractParams" &&
            implDeployParams?.length > 0 ? (
            <NextButton
              disabled={disableNext}
              onClick={() => setFieldsetToShow("implParams")}
            />
          ) : (
            <div className="flex items-start justify-between gap-4 w-full">
              <span className="text-sm text-muted-foreground">
                Publishing your contract is free, we cover all gas costs
              </span>

              <Button
                className="gap-2"
                form={formId}
                disabled={isDisabled}
                type="submit"
              >
                {isPending && <Spinner className="size-4" />}
                {sendTx.isSuccess
                  ? "Preparing page"
                  : sendTx.isPending
                    ? "Publishing contract"
                    : "Publish Contract"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function NextButton(props: { disabled: boolean; onClick: () => void }) {
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      className="gap-2 w-32"
    >
      Next
      <ArrowRightIcon className="size-4" />
    </Button>
  );
}
