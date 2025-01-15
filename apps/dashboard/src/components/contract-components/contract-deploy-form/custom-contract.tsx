"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  FormControl,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyContract } from "app/(dashboard)/(chain)/[chain_id]/[contractAddress]/sources/ContractSourcesPage";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { CircleAlertIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import {
  ZERO_ADDRESS,
  eth_getTransactionCount,
  getContract,
  getRpcClient,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  deployContractfromDeployMetadata,
  deployMarketplaceContract,
  getRequiredTransactions,
} from "thirdweb/deploys";
import { installPublishedModule } from "thirdweb/modules";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import {
  type AbiFunction,
  concatHex,
  encodeAbiParameters,
  padHex,
} from "thirdweb/utils";
import { isZkSyncChain } from "thirdweb/utils";
import { FormHelperText, FormLabel, Heading, Text } from "tw-components";
import { useCustomFactoryAbi, useFunctionParamsFromABI } from "../hooks";
import { addContractToMultiChainRegistry } from "../utils";
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
}

type CustomContractDeploymentFormData = {
  addToDashboard: boolean;
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
}) => {
  const thirdwebClient = useThirdwebClient(jwt);

  const activeAccount = useActiveAccount();
  const walletChain = useActiveWalletChain();
  const { onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );
  const trackEvent = useTrack();

  const constructorParams =
    metadata.abi.find((a) => a.type === "constructor")?.inputs || [];

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

  const isSuperchainInterop = !!modules?.find(
    (m) => m.name === "SuperChainInterop",
  );

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
        addToDashboard: true,
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
            platformFeeBps: Number(params.deployParams._platformFeeBps),
            platformFeeRecipient: params.deployParams
              ._platformFeeRecipient as string,
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
      };

      const salt = isSuperchainInterop
        ? concatHex(["0x0101", padHex("0x", { size: 30 })]).toString()
        : params.deployDeterministic
          ? params.signerAsSalt
            ? activeAccount.address.concat(params.saltForCreate2)
            : params.saltForCreate2
          : undefined;

      const moduleDeployData = modules?.map((m) => ({
        deployMetadata: m,
        initializeParams:
          m.name === "SuperChainInterop"
            ? { superchainBridge: "0x4200000000000000000000000000000000000028" }
            : params.moduleData[m.name],
      }));

      const coreContractAddress = await deployContractfromDeployMetadata({
        account: activeAccount,
        chain: walletChain,
        client: thirdwebClient,
        deployMetadata: metadata,
        initializeParams,
        implementationConstructorParams,
        salt,
        isSuperchainInterop,
        modules: isSuperchainInterop
          ? // remove modules for superchain interop in order to deploy deterministically deploy just the core contract
            []
          : moduleDeployData,
      });
      const coreContract = getContract({
        client: thirdwebClient,
        address: coreContractAddress,
        chain: walletChain,
      });

      if (isSuperchainInterop && moduleDeployData) {
        const rpcRequest = getRpcClient({
          client: thirdwebClient,
          chain: walletChain,
        });
        const currentNonce = await eth_getTransactionCount(rpcRequest, {
          address: activeAccount.address,
        });

        for (const [i, m] of moduleDeployData.entries()) {
          let moduleData: `0x${string}` | undefined;

          const moduleInstallParams = m.deployMetadata.abi.find(
            (abiType) =>
              (abiType as AbiFunction).name === "encodeBytesOnInstall",
          ) as AbiFunction | undefined;

          if (m.initializeParams && moduleInstallParams) {
            moduleData = encodeAbiParameters(
              (
                moduleInstallParams.inputs as { name: string; type: string }[]
              ).map((p) => ({
                name: p.name,
                type: p.type,
              })),
              Object.values(m.initializeParams),
            );
          }

          console.log("nonce used: ", currentNonce + i);

          const installTransaction = installPublishedModule({
            contract: coreContract,
            account: activeAccount,
            moduleName: m.deployMetadata.name,
            publisher: m.deployMetadata.publisher,
            version: m.deployMetadata.version,
            moduleData,
            nonce: currentNonce + i,
          });

          const txResult = await sendTransaction({
            transaction: installTransaction,
            account: activeAccount,
          });

          await waitForReceipt(txResult);
          // can't handle parallel transactions, so wait a bit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

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
            let steps: DeployModalStep[] = [
              {
                type: "deploy",
                signatureCount: deployTransactions.data?.length || 1,
              },
            ];
            // if the add to dashboard is checked add that step
            if (formData.addToDashboard) {
              steps = [
                ...steps,
                {
                  type: "import",
                  signatureCount: 1,
                },
              ];
            }

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
              verifyContract({
                address: contractAddr,
                chain: walletChain,
                client: thirdwebClient,
              });

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
              // if add to dashboard is checked, add the contract to the dashboard
              if (formData.addToDashboard) {
                // add the contract to the dashboard
                await addContractToMultiChainRegistry(
                  {
                    address: contractAddr,
                    chainId: walletChain.id,
                  },
                  activeAccount,
                  300000n,
                );
                trackEvent({
                  category: "custom-contract",
                  action: "add-to-dashboard",
                  label: "success",
                  ...publisherAnalyticsData,
                  contractAddress: contractAddr,
                  chainId: walletChain.id,
                  metadataUri: metadata.metadataUri,
                });
                deployStatusModal.nextStep();
              }

              deployStatusModal.setViewContractLink(
                `/${walletChain.id}/${contractAddr}`,
              );
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

              {hasPlatformFee && <PlatformFeeFieldset form={form} />}

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
                    />
                  );
                })}

              {isModular && modules && modules.length > 0 && (
                <ModularContractDefaultModulesFieldset
                  form={form}
                  modules={modules.filter(
                    // superchain interop will have a default value for it's install param
                    (mod) => mod.name !== "SuperChainInterop",
                  )}
                  isTWPublisher={isTWPublisher}
                />
              )}

              {advancedParams.length > 0 && (
                <Accordion allowToggle>
                  <AccordionItem borderColor="borderColor" borderBottom="none">
                    <AccordionButton px={0}>
                      <Heading size="subtitle.md" flex="1" textAlign="left">
                        Advanced Configuration
                      </Heading>

                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel
                      py={4}
                      px={0}
                      as={Flex}
                      flexDir="column"
                      gap={4}
                    >
                      {advancedParams}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          )}

          <Fieldset legend="Deploy Options">
            <div className="flex flex-col gap-6">
              {/* Chain */}
              <FormControl isRequired>
                <FormLabel>Chain</FormLabel>

                <p className="mb-3 text-muted-foreground text-sm">
                  Select a network to deploy this contract on. We recommend
                  starting with a testnet.{" "}
                  <TrackedLinkTW
                    href="/chainlist"
                    category="deploy"
                    label="chainlist"
                    target="_blank"
                    className="text-link-foreground hover:text-foreground"
                  >
                    View all chains
                  </TrackedLinkTW>
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <NetworkSelectorButton
                      networksEnabled={
                        metadata?.name === "AccountFactory" ||
                        metadata?.networksForDeployment?.allNetworks ||
                        !metadata?.networksForDeployment
                          ? undefined
                          : metadata?.networksForDeployment?.networksEnabled
                      }
                    />

                    <Button asChild variant="outline">
                      <Link href="/chainlist" className="gap-2">
                        View all chains <ExternalLinkIcon className="size-4" />
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

              {/* Import Enable/Disable */}
              <CheckboxWithLabel>
                <Checkbox
                  {...form.register("addToDashboard")}
                  checked={form.watch("addToDashboard")}
                  onCheckedChange={(checked) =>
                    form.setValue("addToDashboard", !!checked)
                  }
                />
                <span>
                  Import so I can find it in the list of{" "}
                  <TrackedLinkTW
                    className="text-link-foreground hover:text-foreground"
                    href="/team/~/~/contracts"
                    target="_blank"
                    category="custom-contract"
                    label="visit-dashboard"
                  >
                    my contracts
                  </TrackedLinkTW>
                </span>
              </CheckboxWithLabel>

              {/* Deploy */}
              <div className="flex md:justify-end">
                <Button
                  disabled={!activeAccount || !walletChain}
                  type="submit"
                  size="lg"
                >
                  Deploy Now
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
