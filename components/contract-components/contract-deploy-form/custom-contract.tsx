import {
  useConstructorParamsFromABI,
  useContractEnabledExtensions,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useCustomFactoryAbi,
  useDefaultForwarders,
  useEns,
  useFunctionParamsFromABI,
  useTransactionsForDeploy,
} from "../hooks";
import { ContractMetadataFieldset } from "./contract-metadata-fieldset";
import { Param } from "./param";
import { PlatformFeeFieldset } from "./platform-fee-fieldset";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";
import { Recipient, SplitFieldset } from "./split-fieldset";
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
import { LineaTestnet } from "@thirdweb-dev/chains";
import { TransactionButton } from "components/buttons/TransactionButton";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiHelpCircle } from "react-icons/fi";
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
import { TrustedForwardersFieldset } from "./trusted-forwarders-fieldset";

interface CustomContractFormProps {
  ipfsHash: string;
  selectedChain: number | undefined;
  onChainSelect: (chainId: number) => void;
  isImplementationDeploy?: true;
  onSuccessCallback?: (contractAddress: string) => void;
  walletAddress: string | undefined;
}

const CustomContractForm: React.FC<CustomContractFormProps> = ({
  ipfsHash,
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

  const compilerMetadata = useContractPublishMetadataFromURI(ipfsHash);
  const defaultForwarders = useDefaultForwarders();
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

  const deployParams = isFactoryDeployment
    ? initializerParams
    : constructorParams;

  const isAccountFactory =
    !isFactoryDeployment &&
    (fullPublishMetadata.data?.name.includes("AccountFactory") || false);

  const parseDeployParams = {
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
  };

  // FIXME - temporaryly disabling add to dashboard by default on linea
  const shouldDefaulCheckAddToDashboard = selectedChain
    ? selectedChain !== LineaTestnet.chainId
    : true;

  const form = useForm<{
    addToDashboard: boolean;
    deployDeterministic: boolean;
    saltForCreate2: string;
    signerAsSalt: boolean;
    deployParams: Record<string, string>;
    contractMetadata?: {
      name: string;
      description: string;
      symbol: string;
      image: string;
    };
    recipients?: Recipient[];
  }>({
    defaultValues: {
      addToDashboard: shouldDefaulCheckAddToDashboard,
      deployDeterministic: isAccountFactory,
      saltForCreate2: "",
      signerAsSalt: true,
      deployParams: parseDeployParams,
    },
    values: {
      addToDashboard: shouldDefaulCheckAddToDashboard,
      deployDeterministic: isAccountFactory,
      saltForCreate2: "",
      signerAsSalt: true,
      deployParams: parseDeployParams,
    },
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (selectedChain) {
      form.setValue("addToDashboard", selectedChain !== LineaTestnet.chainId);
    }
  }, [form, selectedChain]);

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
      (isSplit && (paramKey === "_payees" || paramKey === "_shares"))
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
        onSubmit={form.handleSubmit(async (d) => {
          if (!selectedChain) {
            return;
          }
          const deployData = {
            ipfsHash,
            constructorParams: d.deployParams,
            contractMetadata: d,
            publishMetadata: compilerMetadata.data,
            chainId: selectedChain,
            is_proxy: fullPublishMetadata.data?.isDeployableViaProxy,
            is_factory: fullPublishMetadata.data?.isDeployableViaProxy,
          };
          // always respect this since even factory deployments cannot auto-add to registry anymore
          const addToDashboard = d.addToDashboard;
          trackEvent({
            category: "custom-contract",
            action: "deploy",
            label: "attempt",
            deployData,
          });

          deploy.mutate(
            {
              ...d,
              address: walletAddress,
              addToDashboard,
            },
            {
              onSuccess: (deployedContractAddress) => {
                console.info("contract deployed:", {
                  chainId: selectedChain,
                  address: deployedContractAddress,
                });

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
              {hasRoyalty && <RoyaltyFieldset form={form} />}
              {hasPrimarySale && <PrimarySaleFieldset form={form} />}
              {isSplit && <SplitFieldset form={form} />}
              {hasTrustedForwarders && (
                <TrustedForwardersFieldset
                  form={form}
                  forwarders={defaultForwarders}
                />
              )}
              {Object.keys(formDeployParams).map((paramKey) => {
                const deployParam = deployParams.find(
                  (p: any) => p.name === paramKey,
                );
                const contructorParams =
                  fullPublishMetadata.data?.constructorParams || {};
                const extraMetadataParam = contructorParams[paramKey];

                if (
                  shouldHide(paramKey) ||
                  extraMetadataParam?.hidden ||
                  paramKey === "_trustedForwarders"
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
                          (p: any) => p.name === paramKey,
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
            Add to dashboard so I can find it in the list of my contracts at{" "}
            <TrackedLink
              href="https://thirdweb.com/dashboard"
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
                  {...form.register(`saltForCreate2`)}
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
      </Flex>
    </FormProvider>
  );
};

export default CustomContractForm;
