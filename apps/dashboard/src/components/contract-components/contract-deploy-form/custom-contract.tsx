"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
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
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { FiHelpCircle } from "react-icons/fi";
import { ZERO_ADDRESS } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import {
  deployContractfromDeployMetadata,
  getRequiredTransactionCount,
} from "thirdweb/deploys";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { FormHelperText, FormLabel, Heading, Text } from "tw-components";
import { thirdwebClient } from "../../../@/constants/client";
import { useLoggedInUser } from "../../../@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useTxNotifications } from "../../../hooks/useTxNotifications";
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
  showPrimarySaleFiedset,
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
  modules?: FetchDeployMetadataResult[];
}

export type CustomContractDeploymentFormData = {
  addToDashboard: boolean;
  deployDeterministic: boolean;
  saltForCreate2: string;
  signerAsSalt: boolean;
  deployParams: Record<string, string>;
  moduleData: Record<string, Record<string, string>>;
  contractMetadata?: {
    name: string;
    description: string;
    symbol: string;
    image: File;
  };
  recipients?: Recipient[];
};

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

export const CustomContractForm: React.FC<CustomContractFormProps> = ({
  metadata,
  modules,
}) => {
  const activeAccount = useActiveAccount();
  const walletChain = useActiveWalletChain();
  useLoggedInUser();
  const { onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  const constructorParams =
    metadata.abi.find((a) => a.type === "constructor")?.inputs || [];

  const [customFactoryNetwork, customFactoryAddress] = Object.entries(
    metadata?.factoryDeploymentData?.customFactoryInput
      ?.customFactoryAddresses || {},
  )[0] || ["", ""];

  const customFactoryAbi = useCustomFactoryAbi(
    customFactoryAddress,
    Number(customFactoryNetwork),
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
          return acc;
        },
        {} as Record<string, string>,
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
                else if (showPrimarySaleFiedset(paramNames)) {
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
          const contructorParams = metadata?.constructorParams || {};
          const extraMetadataParam = contructorParams[paramKey];

          if (shouldHide(paramKey) || !extraMetadataParam?.hidden) {
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

      const initializeParams = {
        ...params.contractMetadata,
        ...params.deployParams,
        _contractURI,
      };

      const salt = params.deployDeterministic
        ? params.signerAsSalt
          ? activeAccount.address.concat(params.saltForCreate2)
          : params.saltForCreate2
        : undefined;

      return await deployContractfromDeployMetadata({
        account: activeAccount,
        chain: walletChain,
        client: thirdwebClient,
        deployMetadata: metadata,
        initializeParams,
        salt,
        modules: modules?.map((m) => ({
          deployMetadata: m,
          initializeParams: params.moduleData[m.name],
        })),
      });
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

      return await getRequiredTransactionCount({
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
            if (!walletChain?.id || !activeAccount) {
              return;
            }
            if (!deployTransactions.data) {
              return;
            }

            // open the status modal
            let steps: DeployModalStep[] = [
              {
                type: "deploy",
                signatureCount: deployTransactions.data.length,
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
            deployStatusModal.setViewContractLink("");
            deployStatusModal.open(steps);
            try {
              // do the actual deployment
              const contractAddr = await deployMutation.mutateAsync(formData);
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
                deployStatusModal.nextStep();
              }
              deployStatusModal.setViewContractLink(
                `/${walletChain.id}/${contractAddr}`,
              );
            } catch (e) {
              onError(e);
              console.error("failed to deploy contract", e);
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
                    value: form.watch("deployParams._royaltyBps"),
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

                      const contructorParams =
                        metadata?.constructorParams || {};
                      const extraMetadataParam = contructorParams[paramKey];

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

                      const contructorParams =
                        metadata?.constructorParams || {};
                      const extraMetadataParam = contructorParams[paramKey];

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
                  const contructorParams = metadata?.constructorParams || {};
                  const extraMetadataParam = contructorParams[paramKey];

                  if (shouldHide(paramKey) || extraMetadataParam?.hidden) {
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

              {isModular && (
                <>
                  {modules?.length ? (
                    <ModularContractDefaultModulesFieldset
                      form={form}
                      modules={modules}
                      isTWPublisher={isTWPublisher}
                    />
                  ) : (
                    <div className="min-h-[250px] flex justify-center items-center">
                      <Spinner className="size-8" />
                    </div>
                  )}
                </>
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

                <p className="text-muted-foreground text-sm mb-3">
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
                  <div className="flex flex-col md:flex-row gap-4">
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
                  <CheckboxWithLabel>
                    <Checkbox
                      {...form.register("deployDeterministic")}
                      checked={form.watch("deployDeterministic")}
                      onCheckedChange={(c) =>
                        form.setValue("deployDeterministic", !!c)
                      }
                    />
                    <ToolTipLabel label="Allows having the same contract address on multiple chains. You can control the address by specifying a salt for create2 deployment below">
                      <div className="inline-flex gap-1.5 items-center">
                        <span className="tex-sm">
                          Deploy at a deterministic address
                        </span>
                        <FiHelpCircle className="size-4" />
                      </div>
                    </ToolTipLabel>
                  </CheckboxWithLabel>

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
                        solidityType={"string"}
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
                  Import so I can find it in the list of my contracts at{" "}
                  <TrackedLinkTW
                    className="text-link-foreground hover:text-foreground"
                    href="/dashboard"
                    target="_blank"
                    category="custom-contract"
                    label="visit-dashboard"
                  >
                    /dashboard
                  </TrackedLinkTW>
                </span>
              </CheckboxWithLabel>

              {/* Depoy */}
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
