"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { Flex, FormControl } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyContract } from "app/(dashboard)/(chain)/[chain_id]/[contractAddress]/sources/ContractSourcesPage";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import {
  DEFAULT_FEE_BPS,
  DEFAULT_FEE_BPS_NEW,
  DEFAULT_FEE_RECIPIENT,
  THIRDWEB_PUBLISHER_ADDRESS,
} from "constants/addresses";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import {
  ArrowUpFromLineIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { ZERO_ADDRESS, getContract } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  deployContractfromDeployMetadata,
  deployMarketplaceContract,
  getRequiredTransactions,
} from "thirdweb/deploys";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { isZkSyncChain } from "thirdweb/utils";
import { FormHelperText, FormLabel, Text } from "tw-components";
import { useAddContractToProject } from "../../../app/team/[team_slug]/[project_slug]/hooks/project-contracts";
import { useCustomFactoryAbi, useFunctionParamsFromABI } from "../hooks";
import {
  AddToProjectCardUI,
  type MinimalTeamsAndProjects,
} from "./add-to-project-card";
import { Fieldset } from "./common";
import { ContractMetadataFieldset } from "./contract-metadata-fieldset";
import {
  type DeployModalStep,
  DeployStatusModal,
  useDeployStatusModal,
} from "./deploy-context-modal";
import {
  ModularContractDefaultModulesFieldset,
  getModuleInstallParams,
  showPrimarySaleFieldset,
  showRoyaltyFieldset,
} from "./modular-contract-default-modules-fieldset";
import { Param } from "./param";
import { PlatformFeeFieldset } from "./platform-fee-fieldset";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";
import { type Recipient, SplitFieldset } from "./split-fieldset";
import { TrustedForwardersFieldset } from "./trusted-forwarders-fieldset";

interface CustomContractFormProps {
  metadata: FetchDeployMetadataResult;
  jwt: string;
  modules?: FetchDeployMetadataResult[];
  teamsAndProjects: MinimalTeamsAndProjects;
}

type CustomContractDeploymentFormData = {
  deployDeterministic: boolean;
  saltForCreate2: string;
  signerAsSalt: boolean;
  deployParams: Record<string, string | DynamicValue>;
  moduleData: Record<string, Record<string, string>>;
  contractMetadata?: {
    name: string;
    description: string;
    symbol: string;
    image: File;
  };
  recipients?: Recipient[];
};

export interface DynamicValue {
  dynamicValue: {
    type: string;
    refContracts?: {
      publisherAddress: string;
      version: string;
      contractId: string;
      salt?: string;
    }[];
  };
}

export type CustomContractDeploymentForm =
  UseFormReturn<CustomContractDeploymentFormData>;

const rewardParamsSet = new Set([
  "_rewardToken",
  "_stakingToken",
  "_timeUnit",
  "_rewardsPerUnitTime",
]);

const voteParamsSet = new Set([
  "_token",
  "_initialVotingDelay",
  "_initialVotingPeriod",
  "_initialProposalThreshold",
  "_initialVoteQuorumFraction",
]);

function checkTwPublisher(publisher: string | undefined) {
  switch (publisher) {
    case "deployer.thirdweb.eth":
    case "thirdweb.eth":
    // the literal publisher address
    case "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024":
      return true;
    default:
      return false;
  }
}

function rewriteTwPublisher(publisher: string | undefined) {
  if (checkTwPublisher(publisher)) {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

export const CustomContractForm: React.FC<CustomContractFormProps> = ({
  metadata,
  modules,
  jwt,
  teamsAndProjects,
}) => {
  const thirdwebClient = useThirdwebClient(jwt);

  const [isImportEnabled, setIsImportEnabled] = useState(true);
  const [importSelection, setImportSelection] = useState({
    team: teamsAndProjects[0]?.team,
    project: teamsAndProjects[0]?.projects[0],
  });

  const activeAccount = useActiveAccount();
  const walletChain = useActiveWalletChain();
  const { onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );
  const trackEvent = useTrack();

  const constructorParams =
    metadata.abi.find((a) => a.type === "constructor")?.inputs || [];

  const defaultFeeRecipientFunction = metadata.abi.find(
    (a) => a.type === "function" && a.name === "DEFAULT_FEE_RECIPIENT",
  );
  const hasInbuiltDefaultFeeConfig =
    defaultFeeRecipientFunction &&
    metadata.publisher === THIRDWEB_PUBLISHER_ADDRESS;

  const [customFactoryNetwork, customFactoryAddress] = Object.entries(
    metadata?.factoryDeploymentData?.customFactoryInput
      ?.customFactoryAddresses || {},
  )[0] || ["", ""];

  const customFactoryAbi = useCustomFactoryAbi(
    customFactoryAddress,
    customFactoryNetwork ? Number(customFactoryNetwork) : undefined,
  );

  const isTWPublisher = checkTwPublisher(metadata?.publisher);

  const initializerParams = useFunctionParamsFromABI(
    metadata?.deployType === "customFactory" && customFactoryAbi?.data
      ? customFactoryAbi.data
      : metadata?.abi,
    metadata?.deployType === "customFactory"
      ? metadata?.factoryDeploymentData?.customFactoryInput?.factoryFunction ||
          "deployProxyByImplementation"
      : metadata?.factoryDeploymentData?.implementationInitializerFunction ||
          "initialize",
  );

  const implementationConstructorParams = metadata?.implConstructorParams;

  const isFactoryDeployment =
    metadata?.isDeployableViaFactory ||
    metadata?.isDeployableViaProxy ||
    metadata?.deployType === "autoFactory" ||
    metadata?.deployType === "customFactory";

  const isModular = metadata?.routerType === "modular";

  const deployParams =
    (isFactoryDeployment ? initializerParams : constructorParams) || [];

  const isAccountFactory =
    !isFactoryDeployment &&
    (metadata?.name.includes("AccountFactory") || false);

  const isMarketplace = metadata?.name.includes("MarketplaceV3") || false;

  const parsedDeployParams = useMemo(
    () => ({
      ...deployParams.reduce(
        (acc, param) => {
          if (!param.name) {
            param.name = "*";
          }

          acc[param.name] = replaceTemplateValues(
            metadata?.constructorParams?.[param.name]?.defaultValue
              ? metadata?.constructorParams?.[param.name]?.defaultValue || ""
              : param.name === "_royaltyBps" || param.name === "_platformFeeBps"
                ? "0"
                : "",
            param.type,
            {
              connectedWallet: activeAccount?.address,
              chainId: walletChain?.id,
            },
          );

          // if _defaultAdmin is not prefilled with activeAccount address with the replaceTemplateValues, do it here
          // because _defaultAdmin is hidden in the form
          if (
            param.name === "_defaultAdmin" &&
            param.type === "address" &&
            !acc[param.name] &&
            activeAccount
          ) {
            acc[param.name] = activeAccount.address;
          }

          // specify refs if present
          const dynamicValue =
            metadata?.constructorParams?.[param.name]?.dynamicValue;
          if (dynamicValue && acc[param.name] === "") {
            acc[param.name] = { dynamicValue };
          }

          return acc;
        },
        {} as Record<string, string | DynamicValue>,
      ),
    }),
    [deployParams, metadata?.constructorParams, activeAccount, walletChain?.id],
  );

  const transformedQueryData = useMemo(
    () =>
      ({
        deployDeterministic: isAccountFactory,
        saltForCreate2: "",
        signerAsSalt: true,
        deployParams: parsedDeployParams,
        recipients: [
          { address: activeAccount?.address || "", sharesBps: 10000 },
        ],
        // set default values for modular contract modules with custom components
        moduleData:
          (activeAccount &&
            isTWPublisher &&
            modules?.reduce(
              (acc, mod) => {
                const params = getModuleInstallParams(mod);
                const paramNames = params
                  .map((param) => param.name)
                  .filter((p) => p !== undefined);
                const returnVal: Record<string, string> = {};

                // set connected wallet address as default "royaltyRecipient"
                if (showRoyaltyFieldset(paramNames)) {
                  returnVal.royaltyRecipient = activeAccount.address;
                  returnVal.royaltyBps = "0";
                  returnVal.transferValidator = ZERO_ADDRESS;
                }

                // set connected wallet address as default "primarySaleRecipient"
                else if (showPrimarySaleFieldset(paramNames)) {
                  returnVal.primarySaleRecipient = activeAccount.address;
                }

                acc[mod.name] = returnVal;
                return acc;
              },
              {} as Record<string, Record<string, string>>,
            )) ||
          {},
      }) satisfies CustomContractDeploymentFormData,
    [
      parsedDeployParams,
      isAccountFactory,
      activeAccount,
      modules,
      isTWPublisher,
    ],
  );

  const form = useForm<CustomContractDeploymentFormData>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });
  const formDeployParams = form.watch("deployParams");

  const hasContractURI = "_contractURI" in formDeployParams;
  const hasRoyalty =
    "_royaltyBps" in formDeployParams &&
    "_royaltyRecipient" in formDeployParams;
  const hasPrimarySale = "_saleRecipient" in formDeployParams;
  const hasPrimarySaleRecipient = "_primarySaleRecipient" in formDeployParams;
  const hasPlatformFee =
    "_platformFeeBps" in formDeployParams &&
    "_platformFeeRecipient" in formDeployParams;
  const isSplit =
    "_payees" in formDeployParams && "_shares" in formDeployParams;
  const hasTrustedForwarders = "_trustedForwarders" in formDeployParams;

  const rewardDeployParams = Object.keys(formDeployParams).filter((paramKey) =>
    rewardParamsSet.has(paramKey),
  );

  const voteDeployParams = Object.keys(formDeployParams).filter((paramKey) =>
    voteParamsSet.has(paramKey),
  );

  const showRewardsSection = rewardDeployParams.length === rewardParamsSet.size;
  const showVoteSection = voteDeployParams.length === voteParamsSet.size;

  const shouldHide = useCallback(
    (paramKey: string) => {
      if (isAccountFactory) {
        return false;
      }
      if (
        (hasContractURI &&
          (paramKey === "_contractURI" ||
            paramKey === "_name" ||
            paramKey === "_symbol")) ||
        (hasRoyalty &&
          (paramKey === "_royaltyBps" || paramKey === "_royaltyRecipient")) ||
        (hasPrimarySale && paramKey === "_saleRecipient") ||
        (hasPrimarySaleRecipient && paramKey === "_primarySaleRecipient") ||
        (showRewardsSection && rewardParamsSet.has(paramKey)) ||
        (showVoteSection && voteParamsSet.has(paramKey)) ||
        (hasPlatformFee &&
          (paramKey === "_platformFeeBps" ||
            paramKey === "_platformFeeRecipient")) ||
        paramKey === "_defaultAdmin" ||
        (isSplit && (paramKey === "_payees" || paramKey === "_shares")) ||
        paramKey === "_trustedForwarders" ||
        // hide module keys if we have `modules` passed
        (modules?.length &&
          (paramKey === "_modules" || paramKey === "_moduleInstallData"))
      ) {
        return true;
      }

      return false;
    },
    [
      hasContractURI,
      hasRoyalty,
      hasPlatformFee,
      hasPrimarySale,
      hasPrimarySaleRecipient,
      isSplit,
      showRewardsSection,
      showVoteSection,
      isAccountFactory,
      modules,
    ],
  );

  const isCreate2Deployment = form.watch("deployDeterministic");
  const advancedParams = useMemo(
    () =>
      Object.keys(formDeployParams)
        .map((paramKey) => {
          const deployParam = deployParams.find((p) => p.name === paramKey);
          const constructorParams = metadata?.constructorParams || {};
          const extraMetadataParam = constructorParams[paramKey];

          if (
            shouldHide(paramKey) ||
            extraMetadataParam?.hidden !== true ||
            extraMetadataParam?.dynamicValue
          ) {
            return null;
          }

          return (
            <Param
              key={paramKey}
              paramKey={paramKey}
              deployParam={deployParam}
              extraMetadataParam={extraMetadataParam}
              isRequired
              inputClassName="bg-background"
            />
          );
        })
        .filter((x) => x !== null),
    [formDeployParams, deployParams, metadata.constructorParams, shouldHide],
  );

  // mutations go here

  const deployStatusModal = useDeployStatusModal();

  const deployMutation = useMutation({
    mutationFn: async (params: CustomContractDeploymentFormData) => {
      if (!activeAccount) {
        throw new Error("no account");
      }
      if (!walletChain) {
        throw new Error("no chain");
      }

      let _contractURI = "";

      if (hasContractURI && params.contractMetadata) {
        // upload the contract metadata
        _contractURI = await upload({
          client: thirdwebClient,
          files: [params.contractMetadata],
        });
      }

      // handle split things
      const payees: string[] = [];
      const shares: string[] = [];
      if (isSplit && params.recipients?.length) {
        for (const recipient of params.recipients) {
          payees.push(recipient.address);
          shares.push(recipient.sharesBps.toString());
        }
      }

      if (
        metadata.name === "MarketplaceV3" &&
        !(await isZkSyncChain(walletChain))
      ) {
        // special case for marketplace
        return await deployMarketplaceContract({
          account: activeAccount,
          chain: walletChain,
          client: thirdwebClient,
          params: {
            name: params.contractMetadata?.name || "",
            contractURI: _contractURI,
            defaultAdmin: params.deployParams._defaultAdmin as string,
            platformFeeBps: hasInbuiltDefaultFeeConfig
              ? DEFAULT_FEE_BPS_NEW
              : DEFAULT_FEE_BPS,
            platformFeeRecipient: DEFAULT_FEE_RECIPIENT,
            trustedForwarders: params.deployParams._trustedForwarders
              ? JSON.parse(params.deployParams._trustedForwarders as string)
              : undefined,
          },
          version: metadata.version,
        });
      }

      const initializeParams = {
        ...params.contractMetadata,
        ...params.deployParams,
        payees,
        shares,
        _contractURI,
        platformFeeBps: hasInbuiltDefaultFeeConfig
          ? DEFAULT_FEE_BPS_NEW
          : DEFAULT_FEE_BPS,
        platformFeeRecipient: DEFAULT_FEE_RECIPIENT,
      };

      const salt = params.deployDeterministic
        ? params.signerAsSalt
          ? activeAccount.address.concat(params.saltForCreate2)
          : params.saltForCreate2
        : undefined;

      const moduleDeployData = modules?.map((m) => ({
        deployMetadata: m,
        initializeParams: params.moduleData[m.name],
      }));

      const coreContractAddress = await deployContractfromDeployMetadata({
        account: activeAccount,
        chain: walletChain,
        client: thirdwebClient,
        deployMetadata: metadata,
        initializeParams,
        implementationConstructorParams,
        salt,
        modules: moduleDeployData,
      });

      return coreContractAddress;
    },
  });

  const deployTransactions = useQuery({
    queryKey: [
      "deployTransactions",
      {
        chainId: walletChain?.id,
        name: metadata.name,
        publisher: metadata.publisher,
        uri: metadata.metadataUri,
        moduleUris: modules?.map((m) => m.metadataUri),
      },
    ],
    queryFn: async () => {
      if (!walletChain) {
        throw new Error("no wallet chain");
      }

      return await getRequiredTransactions({
        chain: walletChain,
        client: thirdwebClient,
        deployMetadata: metadata,
        modules: modules?.map((m) => ({
          deployMetadata: m,
        })),
      });
    },
    enabled: walletChain !== undefined && metadata !== undefined,
  });

  const shouldShowDeterministicDeployWarning =
    constructorParams.length > 0 && form.watch("deployDeterministic");

  const addContractToProjectMutation = useAddContractToProject();

  return (
    <>
      <FormProvider {...form}>
        <Flex
          flexGrow={1}
          minH="full"
          gap={8}
          direction="column"
          id="custom-contract-form"
          as="form"
          onSubmit={form.handleSubmit(async (formData) => {
            if (!walletChain?.id || !activeAccount || !jwt) {
              return;
            }

            // open the status modal
            const steps: DeployModalStep[] = [
              {
                type: "deploy",
                signatureCount: deployTransactions.data?.length || 1,
              },
            ];

            const publisherAnalyticsData = metadata.publisher
              ? {
                  publisherAndContractName: `${rewriteTwPublisher(metadata.publisher)}/${metadata.name}`,
                }
              : {};

            trackEvent({
              category: "custom-contract",
              action: "deploy",
              label: "attempt",
              ...publisherAnalyticsData,
              chainId: walletChain.id,
              metadataUri: metadata.metadataUri,
            });

            deployStatusModal.setViewContractLink("");
            deployStatusModal.open(steps);
            try {
              // do the actual deployment
              const contractAddr = await deployMutation.mutateAsync(formData);

              // send verification request - no need to await
              verifyContract(
                getContract({
                  address: contractAddr,
                  chain: walletChain,
                  client: thirdwebClient,
                }),
              );

              trackEvent({
                category: "custom-contract",
                action: "deploy",
                label: "success",
                ...publisherAnalyticsData,
                contractAddress: contractAddr,
                chainId: walletChain.id,
                metadataUri: metadata.metadataUri,
              });
              deployStatusModal.nextStep();
              deployStatusModal.setViewContractLink(
                `/${walletChain.id}/${contractAddr}`,
              );

              // if the contract should be added to a project
              if (
                importSelection.team &&
                importSelection.project &&
                isImportEnabled
              ) {
                // no await - do it in the background
                addContractToProjectMutation.mutateAsync({
                  chainId: walletChain.id.toString(),
                  contractAddress: contractAddr,
                  projectId: importSelection.project.id,
                  teamId: importSelection.team.id,
                });
              }
            } catch (e) {
              onError(e);
              console.error("failed to deploy contract", e);
              trackEvent({
                category: "custom-contract",
                action: "error",
                label: "success",
                ...publisherAnalyticsData,
                chainId: walletChain.id,
                metadataUri: metadata.metadataUri,
                error: e,
              });
              deployStatusModal.close();
            }
          })}
        >
          {Object.keys(formDeployParams).length > 0 && (
            <>
              {/* Contract Metadata */}
              {hasContractURI && <ContractMetadataFieldset form={form} />}

              {/* Primary Sale */}
              {hasPrimarySale && (
                <PrimarySaleFieldset
                  isInvalid={
                    !!form.getFieldState(
                      "deployParams._saleRecipient",
                      form.formState,
                    ).error
                  }
                  register={form.register("deployParams._saleRecipient")}
                  errorMessage={
                    form.getFieldState(
                      "deployParams._saleRecipient",
                      form.formState,
                    ).error?.message
                  }
                />
              )}

              {hasPrimarySaleRecipient && (
                <PrimarySaleFieldset
                  isInvalid={
                    !!form.getFieldState(
                      "deployParams._primarySaleRecipient",
                      form.formState,
                    ).error
                  }
                  register={form.register("deployParams._primarySaleRecipient")}
                  errorMessage={
                    form.getFieldState(
                      "deployParams._primarySaleRecipient",
                      form.formState,
                    ).error?.message
                  }
                />
              )}

              {/* Royalty */}
              {hasRoyalty && (
                <RoyaltyFieldset
                  royaltyRecipient={{
                    isInvalid: !!form.getFieldState(
                      "deployParams._royaltyRecipient",
                      form.formState,
                    ).error,
                    register: form.register("deployParams._royaltyRecipient"),
                    errorMessage: form.getFieldState(
                      "deployParams._royaltyRecipient",
                      form.formState,
                    ).error?.message,
                  }}
                  royaltyBps={{
                    value: form.watch("deployParams._royaltyBps") as string,
                    isInvalid: !!form.getFieldState(
                      "deployParams._royaltyBps",
                      form.formState,
                    ).error,
                    setValue: (v) => {
                      form.setValue("deployParams._royaltyBps", v, {
                        shouldTouch: true,
                      });
                    },
                    errorMessage: form.getFieldState(
                      "deployParams._royaltyBps",
                      form.formState,
                    ).error?.message,
                  }}
                />
              )}

              {hasPlatformFee && (
                <PlatformFeeFieldset isMarketplace={isMarketplace} />
              )}

              {isSplit && <SplitFieldset form={form} />}

              {hasTrustedForwarders && (
                <TrustedForwardersFieldset form={form} />
              )}

              {/* for StakeERC721 */}
              {showRewardsSection && (
                <Fieldset legend="Reward Parameters">
                  <div className="flex flex-col gap-6">
                    {rewardDeployParams.map((paramKey) => {
                      const deployParam = deployParams.find(
                        (p) => p.name === paramKey,
                      );

                      const constructorParams =
                        metadata?.constructorParams || {};
                      const extraMetadataParam = constructorParams[paramKey];

                      return (
                        <Param
                          key={paramKey}
                          paramKey={paramKey}
                          deployParam={deployParam}
                          extraMetadataParam={extraMetadataParam}
                          isRequired
                        />
                      );
                    })}
                  </div>
                </Fieldset>
              )}

              {/* for Vote */}
              {showVoteSection && (
                <Fieldset legend="Voting Parameters">
                  <div className="flex flex-col gap-6">
                    {voteDeployParams.map((paramKey) => {
                      const deployParam = deployParams.find(
                        (p) => p.name === paramKey,
                      );

                      const constructorParams =
                        metadata?.constructorParams || {};
                      const extraMetadataParam = constructorParams[paramKey];

                      return (
                        <Param
                          key={paramKey}
                          paramKey={paramKey}
                          deployParam={deployParam}
                          extraMetadataParam={extraMetadataParam}
                          isRequired
                        />
                      );
                    })}
                  </div>
                </Fieldset>
              )}

              {Object.keys(formDeployParams)
                .filter((paramName) => {
                  if (
                    isModular &&
                    (paramName === "_moduleInstallData" ||
                      paramName === "_modules")
                  ) {
                    return false;
                  }

                  return true;
                })
                .map((paramKey) => {
                  const deployParam = deployParams.find(
                    (p) => p.name === paramKey,
                  );
                  const constructorParams = metadata?.constructorParams || {};
                  const extraMetadataParam = constructorParams[paramKey];

                  if (
                    shouldHide(paramKey) ||
                    extraMetadataParam?.hidden === true ||
                    extraMetadataParam?.dynamicValue
                  ) {
                    return null;
                  }

                  return (
                    <Param
                      key={paramKey}
                      paramKey={paramKey}
                      deployParam={deployParam}
                      extraMetadataParam={extraMetadataParam}
                      inputClassName="bg-card"
                      isRequired
                    />
                  );
                })}

              {isModular && modules && modules.length > 0 && (
                <ModularContractDefaultModulesFieldset
                  form={form}
                  modules={modules}
                  isTWPublisher={isTWPublisher}
                />
              )}

              {advancedParams.length > 0 && (
                <Accordion
                  type="single"
                  collapsible
                  className="rounded-lg border border-border bg-card"
                >
                  <AccordionItem value="advanced" className="border-b-0">
                    <AccordionTrigger className="px-4 font-semibold text-xl tracking-tight lg:px-6">
                      Advanced Configuration
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-5 border-border border-t px-4 pt-6 pb-8 lg:px-6">
                      {advancedParams}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          )}

          <AddToProjectCardUI
            client={thirdwebClient}
            teamsAndProjects={teamsAndProjects}
            selection={importSelection}
            enabled={isImportEnabled}
            onSelectionChange={setImportSelection}
            onSetEnabled={setIsImportEnabled}
          />

          <Fieldset legend="Deploy Options">
            <div className="flex flex-col gap-6">
              {/* Chain */}
              <FormControl isRequired>
                <FormLabel>Chain</FormLabel>

                <p className="mb-3 text-muted-foreground text-sm">
                  Select a network to deploy this contract on. We recommend
                  starting with a testnet
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <NetworkSelectorButton
                      className="bg-background"
                      networksEnabled={
                        metadata?.name === "AccountFactory" ||
                        metadata?.networksForDeployment?.allNetworks ||
                        !metadata?.networksForDeployment
                          ? undefined
                          : metadata?.networksForDeployment?.networksEnabled
                      }
                    />

                    <Button asChild variant="outline">
                      <Link href="/chainlist" className="gap-3" target="_blank">
                        View all chains
                        <ExternalLinkIcon className="size-4 bg-background text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </FormControl>

              {metadata?.deployType === "standard" && (
                <>
                  {/* Deterministic deploy */}

                  <div className="flex flex-col gap-3">
                    <CheckboxWithLabel>
                      <Checkbox
                        {...form.register("deployDeterministic")}
                        checked={form.watch("deployDeterministic")}
                        onCheckedChange={(c) =>
                          form.setValue("deployDeterministic", !!c)
                        }
                      />
                      <ToolTipLabel label="Allows having the same contract address on multiple chains. You can control the address by specifying a salt for create2 deployment below">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="tex-sm">
                            Deploy at a deterministic address
                          </span>
                          <InfoIcon className="size-4" />
                        </div>
                      </ToolTipLabel>
                    </CheckboxWithLabel>

                    {shouldShowDeterministicDeployWarning && (
                      <Alert variant="warning">
                        <CircleAlertIcon className="size-5" />
                        <AlertTitle>
                          Deterministic deployment would only result in the same
                          contract address if you use the same constructor
                          params on every deployment.
                        </AlertTitle>
                      </Alert>
                    )}
                  </div>

                  {/*  Optional Salt Input */}
                  {isCreate2Deployment && (
                    <FormControl>
                      <Flex alignItems="center" my={1}>
                        <FormLabel mb={0} flex="1" display="flex">
                          <Flex alignItems="baseline" gap={1}>
                            Optional Salt Input
                            <Text size="label.sm">(saltForCreate2)</Text>
                          </Flex>
                        </FormLabel>
                        <FormHelperText mt={0}>string</FormHelperText>
                      </Flex>
                      <SolidityInput
                        solidityType="string"
                        {...form.register("saltForCreate2")}
                      />
                      <div className="h-2" />
                      <CheckboxWithLabel>
                        <Checkbox
                          {...form.register("signerAsSalt")}
                          checked={form.watch("signerAsSalt")}
                          onCheckedChange={(c) =>
                            form.setValue("signerAsSalt", !!c)
                          }
                        />
                        <span className="text-sm">
                          Include deployer wallet address in salt (recommended)
                        </span>
                      </CheckboxWithLabel>
                    </FormControl>
                  )}
                </>
              )}

              {/* Deploy */}
              <div className="flex border-border border-t pt-6 md:justify-end">
                <Button
                  disabled={!activeAccount || !walletChain}
                  type="submit"
                  className="gap-2"
                >
                  Deploy Now
                  <ArrowUpFromLineIcon className="size-4" />
                </Button>
              </div>
            </div>
          </Fieldset>
        </Flex>
      </FormProvider>
      <DeployStatusModal deployStatusModal={deployStatusModal} />
    </>
  );
};
