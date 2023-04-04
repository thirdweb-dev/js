import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
  useEns,
  useFunctionParamsFromABI,
} from "../hooks";
import { ConfigureNetworkButton } from "../shared/configure-network-button";
import { ContractMetadataFieldset } from "./contract-metadata-fieldset";
import { PlatformFeeFieldset } from "./platform-fee-fieldset";
import { PrimarySaleFieldset } from "./primary-sale-fieldset";
import { RoyaltyFieldset } from "./royalty-fieldset";
import { Recipient, SplitFieldset } from "./split-fieldset";
import { Divider, Flex, FormControl } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import {
  THIRDWEB_DEPLOYER_ADDRESS,
  THIRDWEB_DEPLOYER_ENS,
} from "constants/addresses";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { verifyContract } from "contract-ui/tabs/sources/page";
import { useTrack } from "hooks/analytics/useTrack";
import {
  useConfiguredChain,
  useConfiguredChains,
} from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceTemplateValues } from "lib/deployment/template-values";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import {
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";

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
  const configuredChains = useConfiguredChains();
  const configuredChainsIds = configuredChains.map((c) => c.chainId);

  const networkInfo = useConfiguredChain(selectedChain || -1);
  const ensQuery = useEns(walletAddress);
  const connectedWallet = ensQuery.data?.address || walletAddress;
  const trackEvent = useTrack();
  const compilerMetadata = useContractPublishMetadataFromURI(ipfsHash);
  const fullPublishMetadata = useContractFullPublishMetadata(ipfsHash);
  const constructorParams = useConstructorParamsFromABI(
    compilerMetadata.data?.abi,
  );
  const initializerParams = useFunctionParamsFromABI(
    compilerMetadata.data?.abi,
    fullPublishMetadata.data?.factoryDeploymentData
      ?.implementationInitializerFunction || "initialize",
  );
  const isFactoryDeployment =
    (fullPublishMetadata.data?.isDeployableViaFactory ||
      fullPublishMetadata.data?.isDeployableViaProxy) &&
    !isImplementationDeploy;

  const deployParams = isFactoryDeployment
    ? initializerParams
    : constructorParams;

  // for our own contracts, we force enable all chains since the SDK has fallbacks in place to deploy everywhere
  const shouldForceEnableAllChains =
    fullPublishMetadata?.data?.publisher === THIRDWEB_DEPLOYER_ENS ||
    fullPublishMetadata?.data?.publisher === THIRDWEB_DEPLOYER_ADDRESS;

  const disabledChainIds = shouldForceEnableAllChains
    ? undefined
    : isFactoryDeployment && fullPublishMetadata.data?.factoryDeploymentData
    ? configuredChainsIds.filter((chain) => {
        const implementationAddress =
          fullPublishMetadata.data?.factoryDeploymentData
            ?.implementationAddresses?.[chain];
        return !implementationAddress;
      })
    : undefined;

  const form = useForm<{
    addToDashboard: boolean;
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
      addToDashboard: true,
      deployParams: {
        ...deployParams.reduce((acc, param) => {
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
        }, {} as Record<string, string>),
      },
    },
    values: {
      addToDashboard: true,
      deployParams: deployParams.reduce((acc, param) => {
        acc[param.name] = replaceTemplateValues(
          fullPublishMetadata.data?.constructorParams?.[param.name]
            ?.defaultValue || "",
          param.type,
          {
            connectedWallet,
            chainId: selectedChain,
          },
        );
        return acc;
      }, {} as Record<string, string>),
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const formDeployParams = form.watch("deployParams");

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

  const deploy = useCustomContractDeployMutation(
    ipfsHash,
    isImplementationDeploy,
    { hasContractURI, hasRoyalty, hasPrimarySale, hasPlatformFee, isSplit },
  );

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

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

                // try verifying the contract, might as well
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
              {hasPlatformFee && <PlatformFeeFieldset form={form} />}
              {isSplit && <SplitFieldset form={form} />}
            </Flex>
            {Object.keys(formDeployParams).map((paramKey) => {
              const deployParam = deployParams.find((p) => p.name === paramKey);
              const contructorParams =
                fullPublishMetadata.data?.constructorParams || {};
              const extraMetadataParam = contructorParams[paramKey];

              if (
                (hasContractURI &&
                  (paramKey === "_contractURI" ||
                    paramKey === "_name" ||
                    paramKey === "_symbol")) ||
                (hasRoyalty &&
                  (paramKey === "_royaltyBps" ||
                    paramKey === "_royaltyRecipient")) ||
                (hasPrimarySale && paramKey === "_saleRecipient") ||
                (hasPlatformFee &&
                  (paramKey === "_platformFeeBps" ||
                    paramKey === "_platformFeeRecipient")) ||
                paramKey === "_defaultAdmin" ||
                paramKey === "_trustedForwarders" ||
                (isSplit && (paramKey === "_payees" || paramKey === "_shares"))
              ) {
                return null;
              }

              return (
                <FormControl
                  isRequired
                  key={paramKey}
                  isInvalid={
                    !!form.getFieldState(
                      `deployParams.${paramKey}`,
                      form.formState,
                    ).error
                  }
                >
                  <Flex alignItems="center" my={1}>
                    <FormLabel mb={0} flex="1" display="flex">
                      <Flex alignItems="baseline" gap={1}>
                        {extraMetadataParam?.displayName ||
                          camelToTitle(paramKey)}
                        <Text size="label.sm">({paramKey})</Text>
                      </Flex>
                    </FormLabel>
                    {deployParam && (
                      <FormHelperText mt={0}>{deployParam.type}</FormHelperText>
                    )}
                  </Flex>
                  {deployParam && (
                    <SolidityInput
                      defaultValue={form.watch(`deployParams.${paramKey}`)}
                      solidityType={deployParam.type}
                      {...form.register(`deployParams.${paramKey}`)}
                    />
                  )}
                  <FormErrorMessage>
                    {
                      form.getFieldState(
                        `deployParams.${paramKey}`,
                        form.formState,
                      ).error?.message
                    }
                  </FormErrorMessage>
                  {extraMetadataParam?.description && (
                    <FormHelperText>
                      {extraMetadataParam?.description}
                    </FormHelperText>
                  )}
                </FormControl>
              );
            })}
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

        <Flex alignItems="center" gap={3}>
          <Checkbox {...form.register("addToDashboard")} defaultChecked />

          <Text mt={1}>
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
        </Flex>

        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <FormControl>
            <SupportedNetworkSelect
              isDisabled={
                isImplementationDeploy ||
                deploy.isLoading ||
                !compilerMetadata.isSuccess
              }
              value={selectedChain}
              onChange={(e) => onChainSelect(parseInt(e.currentTarget.value))}
              disabledChainIds={disabledChainIds}
            />
          </FormControl>
          <TransactionButton
            onChainSelect={onChainSelect}
            upsellTestnet
            flexShrink={0}
            type="submit"
            form="custom-contract-form"
            isLoading={deploy.isLoading}
            isDisabled={
              !compilerMetadata.isSuccess ||
              !selectedChain ||
              !!disabledChainIds?.find((chain) => chain === selectedChain)
            }
            colorScheme="blue"
            transactionCount={form.watch("addToDashboard") ? 2 : 1}
          >
            Deploy Now
          </TransactionButton>
        </Flex>

        <ConfigureNetworkButton label="deploy-contract" />
      </Flex>
    </FormProvider>
  );
};

export default CustomContractForm;
