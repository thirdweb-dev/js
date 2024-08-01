import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  FormControl,
  HStack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { verifyContract } from "contract-ui/tabs/sources/page";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form";
import { FiHelpCircle } from "react-icons/fi";
import { useActiveAccount } from "thirdweb/react";
import { encodeAbiParameters } from "thirdweb/utils";
import invariant from "tiny-invariant";
import {
  Card,
  Checkbox,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { Spinner } from "../../../@/components/ui/Spinner/Spinner";
import {
  useConstructorParamsFromABI,
  useContractEnabledExtensions,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useCustomFactoryAbi,
  useEns,
  useFunctionParamsFromABI,
  useTransactionsForDeploy,
} from "../hooks";
import { ContractMetadataFieldset } from "./contract-metadata-fieldset";
import {
  ModularContractDefaultExtensionsFieldset,
  showPrimarySaleFiedset,
  showRoyaltyFieldset,
  useModularContractsDefaultExtensionsInstallParams,
} from "./modular-contract-default-extensions-fieldset";
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
  modularContractDefaultExtensionsInstallParams: Record<string, string>[];
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
  const constructorParams = useConstructorParamsFromABI(
    compilerMetadata.data?.abi,
  );

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
    fullPublishMetadata.data?.deployType === "customFactory" &&
      customFactoryAbi?.data
      ? customFactoryAbi.data
      : compilerMetadata.data?.abi,
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
  const defaultExtensions = fullPublishMetadata.data?.defaultExtensions;

  const modularContractDefaultExtensionsInstallParams =
    useModularContractsDefaultExtensionsInstallParams({
      defaultExtensions,
      isQueryEnabled: isModular,
    });

  const deployParams = isFactoryDeployment
    ? initializerParams
    : constructorParams;

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
      // set default values for modular contract extensions with custom components
      modularContractDefaultExtensionsInstallParams:
        (activeAccount &&
          isTWPublisher &&
          modularContractDefaultExtensionsInstallParams.data?.map((ext) => {
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
      modularContractDefaultExtensionsInstallParams.data,
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

  const anyHiddenParams = Object.keys(formDeployParams).some((paramKey) => {
    const contructorParams = fullPublishMetadata.data?.constructorParams || {};
    const isHidden = contructorParams[paramKey]?.hidden;

    return isHidden;
  });

  const hasContractURI = "_contractURI" in formDeployParams;
  const hasRoyalty =
    "_royaltyBps" in formDeployParams &&
    "_royaltyRecipient" in formDeployParams;
  const hasPrimarySale = "_saleRecipient" in formDeployParams;
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

  const extensions = useContractEnabledExtensions(compilerMetadata.data?.abi);
  const isErc721SharedMetadadata = extensions.some(
    (extension) => extension.name === "ERC721SharedMetadata",
  );

  const deploy = useCustomContractDeployMutation(
    ipfsHash,
    version,
    isImplementationDeploy,
    {
      hasContractURI,
      hasRoyalty,
      isSplit,
      isVote,
      isErc721SharedMetadadata,
    },
  );

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

  return (
    <FormProvider {...form}>
      <Flex
        flexGrow={1}
        minH="full"
        gap={4}
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

          // if Modular contract has extensions
          if (isModular && modularContractDefaultExtensionsInstallParams.data) {
            const extensionInstallData: string[] =
              modularContractDefaultExtensionsInstallParams.data.map(
                (ext, extIndex) => {
                  return encodeAbiParameters(
                    // param name+type []
                    ext.params.map((p) => ({ name: p.name, type: p.type })),
                    // value []
                    Object.values(
                      formData.modularContractDefaultExtensionsInstallParams[
                        extIndex
                      ] || {},
                    ),
                  );
                },
              );

            deployParams._extensionInstallData =
              JSON.stringify(extensionInstallData);
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
                } catch (e) {
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
                  router.replace(
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
            {/* Info */}
            <Flex direction="column">
              <Heading size="subtitle.md">Contract Parameters</Heading>
              <Text size="body.md">
                Parameters the contract specifies to be passed in during
                deployment.
              </Text>
            </Flex>

            <Flex gap={4} flexDir="column">
              {hasContractURI && (
                <ContractMetadataFieldset
                  form={form}
                  metadata={compilerMetadata}
                />
              )}
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
              {isSplit && <SplitFieldset form={form} />}
              {hasTrustedForwarders && (
                <TrustedForwardersFieldset form={form} />
              )}

              {Object.keys(formDeployParams)
                .filter((paramName) => {
                  if (
                    isModular &&
                    (paramName === "_extensionInstallData" ||
                      paramName === "_extensions")
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
                  {modularContractDefaultExtensionsInstallParams.data ? (
                    <ModularContractDefaultExtensionsFieldset
                      form={form}
                      extensions={
                        modularContractDefaultExtensionsInstallParams.data
                      }
                      isTWPublisher={isTWPublisher}
                    />
                  ) : (
                    <div className="min-h-[250px] flex justify-center items-center">
                      <Spinner className="size-8" />
                    </div>
                  )}
                </>
              )}

              {(anyHiddenParams || hasPlatformFee) && (
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
                      {hasPlatformFee && <PlatformFeeFieldset form={form} />}
                      {Object.keys(formDeployParams).map((paramKey) => {
                        const deployParam = deployParams.find(
                          (p) => p.name === paramKey,
                        );
                        const contructorParams =
                          fullPublishMetadata.data?.constructorParams || {};
                        const extraMetadataParam = contructorParams[paramKey];

                        if (
                          shouldHide(paramKey) ||
                          !extraMetadataParam?.hidden
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
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </Flex>
            <Divider mt="auto" />
          </>
        )}

        <Flex direction="column">
          <Heading size="subtitle.md">Network / Chain</Heading>
          <Text size="body.md">
            Select a network to deploy this contract on. We recommend starting
            with a testnet.{" "}
            <TrackedLink
              href="https://blog.thirdweb.com/guides/which-network-should-you-use"
              color="blue.500"
              category="deploy"
              label="learn-networks"
              isExternal
            >
              Learn more about the different networks.
            </TrackedLink>
          </Text>
        </Flex>

        <Checkbox
          {...form.register("addToDashboard")}
          isChecked={form.watch("addToDashboard")}
        >
          <Text>
            Import so I can find it in the list of my contracts at{" "}
            <TrackedLink
              href="/dashboard"
              isExternal
              category="custom-contract"
              label="visit-dashboard"
              color="blue.500"
            >
              /dashboard
            </TrackedLink>
            .
          </Text>
        </Checkbox>

        {fullPublishMetadata.data?.deployType === "standard" && (
          <Flex gap={4} flexDir="column">
            <Checkbox
              {...form.register("deployDeterministic")}
              isChecked={form.watch("deployDeterministic")}
            >
              <Tooltip
                label={
                  <Card py={2} px={4} bgColor="backgroundHighlight">
                    <Text fontSize="small" lineHeight={6}>
                      Allows having the same contract address on multiple
                      chains. You can control the address by specifying a salt
                      for create2 deployment below.
                    </Text>
                  </Card>
                }
                isDisabled={false}
                p={0}
                bg="transparent"
                boxShadow="none"
              >
                <HStack>
                  <Heading as="label" size="label.md">
                    Deploy at a deterministic address
                  </Heading>
                  <Icon as={FiHelpCircle} />
                </HStack>
              </Tooltip>
            </Checkbox>

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
                <Flex alignItems="center" gap={3}>
                  <Checkbox
                    {...form.register("signerAsSalt")}
                    isChecked={form.watch("signerAsSalt")}
                  />

                  <Text mt={1}>
                    Include deployer wallet address in salt (recommended)
                  </Text>
                </Flex>
              </FormControl>
            )}
          </Flex>
        )}

        <Flex gap={4} direction={{ base: "column", md: "row" }}>
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
              fullPublishMetadata.data?.networksForDeployment?.allNetworks ||
              !fullPublishMetadata.data?.networksForDeployment
                ? undefined
                : fullPublishMetadata.data?.networksForDeployment
                    ?.networksEnabled
            }
          />
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
          >
            Deploy Now
          </TransactionButton>
        </Flex>
        <DeprecatedAlert chain={networkInfo} />
      </Flex>
    </FormProvider>
  );
};

export default CustomContractForm;
