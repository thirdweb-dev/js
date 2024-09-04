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
import type { Abi } from "abitype";
import { TransactionButton } from "components/buttons/TransactionButton";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { verifyContract } from "contract-ui/tabs/sources/page";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { FiHelpCircle } from "react-icons/fi";
import { useActiveAccount } from "thirdweb/react";
import { encodeAbiParameters } from "thirdweb/utils";
import invariant from "tiny-invariant";
import { FormHelperText, FormLabel, Heading, Text } from "tw-components";
import {
  useContractEnabledExtensions,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useCustomFactoryAbi,
  useEns,
  useFunctionParamsFromABI,
  useTransactionsForDeploy,
} from "../hooks";
import { Fieldset } from "./common";
import { ContractMetadataFieldset } from "./contract-metadata-fieldset";
import {
  DeployStatusModal,
  useDeployStatusModal,
} from "./deploy-context-modal";
import {
  ModularContractDefaultModulesFieldset,
  showPrimarySaleFiedset,
  showRoyaltyFieldset,
  useModularContractsDefaultModulesInstallParams,
} from "./modular-contract-default-modules-fieldset";
import { Param } from "./param";
import { PlatformFeeFieldset } from "./platform-fee-fieldset";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";
import { type Recipient, SplitFieldset } from "./split-fieldset";
import { TrustedForwardersFieldset } from "./trusted-forwarders-fieldset";

interface CustomContractFormProps {
  ipfsHash: string;
  version?: string;
  selectedChain: number | undefined;
  onChainSelect: (chainId: number) => void;
  isImplementationDeploy?: true;
  onSuccessCallback?: (contractAddress: string) => void;
  walletAddress: string | undefined;
}

export type CustomContractDeploymentFormData = {
  addToDashboard: boolean;
  deployDeterministic: boolean;
  saltForCreate2: string;
  signerAsSalt: boolean;
  deployParams: Record<string, string>;
  modularContractDefaultModulesInstallParams: Record<string, string>[];
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

const CustomContractForm: React.FC<CustomContractFormProps> = ({
  ipfsHash,
  version,
  selectedChain,
  onChainSelect,
  isImplementationDeploy,
  onSuccessCallback,
  walletAddress,
}) => {
  const { data: transactions } = useTransactionsForDeploy(ipfsHash);
  const networkInfo = useSupportedChain(selectedChain || -1);
  const ensQuery = useEns(walletAddress);
  const connectedWallet = ensQuery.data?.address || walletAddress;
  const trackEvent = useTrack();
  const activeAccount = useActiveAccount();

  const compilerMetadata = useContractPublishMetadataFromURI(ipfsHash);
  const fullPublishMetadata = useContractFullPublishMetadata(ipfsHash);
  const constructorParams =
    compilerMetadata.data?.abi?.find((c) => c.type === "constructor")?.inputs ||
    [];

  const [customFactoryNetwork, customFactoryAddress] = Object.entries(
    fullPublishMetadata.data?.factoryDeploymentData?.customFactoryInput
      ?.customFactoryAddresses || {},
  )[0] || ["", ""];

  const customFactoryAbi = useCustomFactoryAbi(
    customFactoryAddress,
    Number(customFactoryNetwork),
  );

  const isTWPublisher =
    fullPublishMetadata.data?.publisher === "deployer.thirdweb.eth";

  const initializerParams = useFunctionParamsFromABI(
    (fullPublishMetadata.data?.deployType === "customFactory" &&
    customFactoryAbi?.data
      ? customFactoryAbi.data
      : compilerMetadata.data?.abi) as Abi | undefined,
    fullPublishMetadata.data?.deployType === "customFactory"
      ? fullPublishMetadata.data?.factoryDeploymentData?.customFactoryInput
          ?.factoryFunction || "deployProxyByImplementation"
      : fullPublishMetadata.data?.factoryDeploymentData
          ?.implementationInitializerFunction || "initialize",
  );

  const isFactoryDeployment =
    ((fullPublishMetadata.data?.isDeployableViaFactory ||
      fullPublishMetadata.data?.isDeployableViaProxy) &&
      !isImplementationDeploy) ||
    fullPublishMetadata.data?.deployType === "autoFactory" ||
    fullPublishMetadata.data?.deployType === "customFactory";

  const isModular = fullPublishMetadata.data?.routerType === "modular";
  const defaultModules = fullPublishMetadata.data?.defaultModules;

  const modularContractDefaultModulesInstallParams =
    useModularContractsDefaultModulesInstallParams({
      defaultModules,
      isQueryEnabled: isModular,
    });

  const deployParams =
    (isFactoryDeployment ? initializerParams : constructorParams) || [];

  const isAccountFactory =
    !isFactoryDeployment &&
    (fullPublishMetadata.data?.name.includes("AccountFactory") || false);

  const parsedDeployParams = useMemo(
    () => ({
      ...deployParams.reduce(
        (acc, param) => {
          if (!param.name) {
            param.name = "*";
          }

          acc[param.name] = replaceTemplateValues(
            fullPublishMetadata.data?.constructorParams?.[param.name]
              ?.defaultValue
              ? fullPublishMetadata.data?.constructorParams?.[param.name]
                  ?.defaultValue || ""
              : param.name === "_royaltyBps" || param.name === "_platformFeeBps"
                ? "0"
                : "",
            param.type,
            {
              connectedWallet,
              chainId: selectedChain,
            },
          );
          return acc;
        },
        {} as Record<string, string>,
      ),
    }),
    [
      deployParams,
      fullPublishMetadata.data?.constructorParams,
      connectedWallet,
      selectedChain,
    ],
  );

  const transformedQueryData = useMemo(
    () => ({
      addToDashboard: true,
      deployDeterministic: isAccountFactory,
      saltForCreate2: "",
      signerAsSalt: true,
      deployParams: parsedDeployParams,
      recipients: [{ address: connectedWallet || "", sharesBps: 10000 }],
      // set default values for modular contract modules with custom components
      modularContractDefaultModulesInstallParams:
        (activeAccount &&
          isTWPublisher &&
          modularContractDefaultModulesInstallParams.data?.map((ext) => {
            const paramNames = ext.params.map((param) => param.name);
            const returnVal: Record<string, string> = {};

            // set connected wallet address as default "royaltyRecipient"
            if (showRoyaltyFieldset(paramNames)) {
              returnVal.royaltyRecipient = activeAccount.address;
            }

            // set connected wallet address as default "primarySaleRecipient"
            else if (showPrimarySaleFiedset(paramNames)) {
              returnVal.primarySaleRecipient = activeAccount.address;
            }

            return returnVal;
          })) ||
        [],
    }),
    [
      parsedDeployParams,
      isAccountFactory,
      connectedWallet,
      modularContractDefaultModulesInstallParams.data,
      isTWPublisher,
      activeAccount,
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
  const isVote =
    "_initialVotingDelay" in formDeployParams &&
    "_initialVotingPeriod" in formDeployParams &&
    "_initialProposalThreshold" in formDeployParams &&
    "_initialVoteQuorumFraction" in formDeployParams &&
    "_token" in formDeployParams;
  const hasTrustedForwarders = "_trustedForwarders" in formDeployParams;

  const rewardDeployParams = Object.keys(formDeployParams).filter((paramKey) =>
    rewardParamsSet.has(paramKey),
  );

  const voteDeployParams = Object.keys(formDeployParams).filter((paramKey) =>
    voteParamsSet.has(paramKey),
  );

  const showRewardsSection = rewardDeployParams.length === rewardParamsSet.size;
  const showVoteSection = voteDeployParams.length === voteParamsSet.size;

  const shouldHide = (paramKey: string) => {
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
      paramKey === "_trustedForwarders"
    ) {
      return true;
    }

    return false;
  };

  const extensions = useContractEnabledExtensions(
    compilerMetadata.data?.abi as Abi | undefined,
  );
  const isErc721SharedMetadadata = extensions.some(
    (extension) => extension.name === "ERC721SharedMetadata",
  );

  const deployStatusModal = useDeployStatusModal();
  const deploy = useCustomContractDeployMutation({
    ipfsHash,
    version,
    forceDirectDeploy: isImplementationDeploy,
    hasContractURI,
    hasRoyalty,
    isSplit,
    isVote,
    isErc721SharedMetadadata,
    deployStatusModal,
  });

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  const transactionCount =
    (transactions?.length || 0) +
    (form.watch("addToDashboard") ? 1 : 0) +
    (isErc721SharedMetadadata ? 1 : 0);

  const isCreate2Deployment = form.watch("deployDeterministic");
  const advancedParams = Object.keys(formDeployParams)
    .map((paramKey) => {
      const deployParam = deployParams.find((p) => p.name === paramKey);
      const contructorParams =
        fullPublishMetadata.data?.constructorParams || {};
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
    .filter((x) => x !== null);

  return (
    <FormProvider {...form}>
      {fullPublishMetadata.isLoading && (
        <div className="min-h-[200px] flex items-center justify-center">
          <Spinner className="size-10" />
        </div>
      )}

      {fullPublishMetadata.isError && (
        <div className="bg-destructive p-4 border border-destructive-text/30 rounded-lg text-destructive-text flex gap-2 items-center">
          <InfoIcon className="size-4" />
          Failed to fetch Publish metadata
        </div>
      )}

      <Flex
        flexGrow={1}
        minH="full"
        gap={8}
        direction="column"
        id="custom-contract-form"
        as="form"
        onSubmit={form.handleSubmit(async (formData) => {
          if (!selectedChain) {
            return;
          }
          const deployData = {
            ipfsHash,
            constructorParams: formData.deployParams,
            contractMetadata: formData,
            publishMetadata: compilerMetadata.data,
            chainId: selectedChain,
            is_proxy: fullPublishMetadata.data?.isDeployableViaProxy,
            is_factory: fullPublishMetadata.data?.isDeployableViaProxy,
          };
          // always respect this since even factory deployments cannot auto-add to registry anymore
          const addToDashboard = formData.addToDashboard;
          trackEvent({
            category: "custom-contract",
            action: "deploy",
            label: "attempt",
            deployData,
          });

          const deployParams = { ...formData.deployParams };

          // if Modular contract has modules
          if (isModular && modularContractDefaultModulesInstallParams.data) {
            const moduleInstallData: string[] =
              modularContractDefaultModulesInstallParams.data.map(
                (ext, extIndex) => {
                  return encodeAbiParameters(
                    // param name+type []
                    ext.params.map((p) => ({ name: p.name, type: p.type })),
                    // value []
                    Object.values(
                      formData.modularContractDefaultModulesInstallParams[
                        extIndex
                      ] || {},
                    ),
                  );
                },
              );

            deployParams._moduleInstallData = JSON.stringify(moduleInstallData);
          }

          deploy.mutate(
            {
              ...formData,
              address: walletAddress,
              addToDashboard,
              deployParams,
            },
            {
              onSuccess: (deployedContractAddress) => {
                console.info("contract deployed:", {
                  chainId: selectedChain,
                  address: deployedContractAddress,
                });

                try {
                  // we don't await this, just kick it off and be done with it
                  verifyContract({
                    contractAddress: deployedContractAddress,
                    chainId: selectedChain,
                  });
                } catch {
                  // ignore
                }

                trackEvent({
                  category: "custom-contract",
                  action: "deploy",
                  label: "success",
                  deployData,
                  contractAddress: deployedContractAddress,
                  addToDashboard,
                  deployer: connectedWallet,
                  contractName: compilerMetadata.data?.name,
                  deployerAndContractName: `${connectedWallet}__${compilerMetadata.data?.name}`,
                  publisherAndContractName: `${
                    fullPublishMetadata.data?.publisher || "deploy-form"
                  }/${compilerMetadata.data?.name}`,
                  releaseAsPath: router.asPath,
                });
                trackEvent({
                  category: "custom-contract",
                  action: "add-to-dashboard",
                  label: "success",
                  contractAddress: deployedContractAddress,
                });
                onSuccess();
                if (onSuccessCallback) {
                  onSuccessCallback(deployedContractAddress || "");
                } else {
                  invariant(
                    networkInfo,
                    `Network not found for chainId ${selectedChain}`,
                  );
                  deployStatusModal.setViewContractLink(
                    `/${networkInfo.slug}/${deployedContractAddress}`,
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
        {Object.keys(formDeployParams).length > 0 && (
          <>
            {/* Contract Metadata */}
            {hasContractURI && (
              <ContractMetadataFieldset
                form={form}
                metadata={compilerMetadata}
              />
            )}

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

            {hasTrustedForwarders && <TrustedForwardersFieldset form={form} />}

            {/* for StakeERC721 */}
            {showRewardsSection && (
              <Fieldset legend="Reward Parameters">
                <div className="flex flex-col gap-6">
                  {rewardDeployParams.map((paramKey) => {
                    const deployParam = deployParams.find(
                      (p) => p.name === paramKey,
                    );

                    const contructorParams =
                      fullPublishMetadata.data?.constructorParams || {};
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
                      fullPublishMetadata.data?.constructorParams || {};
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
                const contructorParams =
                  fullPublishMetadata.data?.constructorParams || {};
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
                {modularContractDefaultModulesInstallParams.data ? (
                  <ModularContractDefaultModulesFieldset
                    form={form}
                    modules={modularContractDefaultModulesInstallParams.data}
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
                    isDisabled={
                      isImplementationDeploy ||
                      deploy.isLoading ||
                      !compilerMetadata.isSuccess
                    }
                    onSwitchChain={(chain) => {
                      onChainSelect(chain.chainId);
                    }}
                    networksEnabled={
                      fullPublishMetadata.data?.name === "AccountFactory" ||
                      fullPublishMetadata.data?.networksForDeployment
                        ?.allNetworks ||
                      !fullPublishMetadata.data?.networksForDeployment
                        ? undefined
                        : fullPublishMetadata.data?.networksForDeployment
                            ?.networksEnabled
                    }
                  />

                  <Button asChild variant="outline">
                    <Link href="/chainlist" className="gap-2">
                      View all chains <ExternalLinkIcon className="size-4" />
                    </Link>
                  </Button>
                </div>

                <DeprecatedAlert chain={networkInfo} />
              </div>
            </FormControl>

            {fullPublishMetadata.data?.deployType === "standard" && (
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
                      defaultValue={""}
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
              <TransactionButton
                onChainSelect={onChainSelect}
                upsellTestnet
                flexShrink={0}
                type="submit"
                form="custom-contract-form"
                isLoading={deploy.isLoading}
                isDisabled={!compilerMetadata.isSuccess || !selectedChain}
                colorScheme="blue"
                transactionCount={transactionCount}
                className="w-full md:w-auto"
              >
                Deploy Now
              </TransactionButton>
            </div>
          </div>
        </Fieldset>
      </Flex>

      <DeployStatusModal deployStatusModal={deployStatusModal} />
    </FormProvider>
  );
};

export default CustomContractForm;
