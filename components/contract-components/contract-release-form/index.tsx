import { DeployFormDrawer } from "../contract-deploy-form/drawer";
import {
  ens,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  usePublishMutation,
} from "../hooks";
import { MarkdownRenderer } from "../released-contract/markdown-renderer";
import { ContractId } from "../types";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  CONTRACT_ADDRESSES,
  ExtraPublishMetadata,
  SUPPORTED_CHAIN_IDS,
} from "@thirdweb-dev/sdk";
import { replaceIpfsUrl } from "components/app-layouts/providers";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCode, BsEye } from "react-icons/bs";
import { FiTrash, FiUpload } from "react-icons/fi";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { SupportedChainIdToNetworkMap } from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";

interface ContractReleaseFormProps {
  contractId: ContractId;
}

export const ContractReleaseForm: React.FC<ContractReleaseFormProps> = ({
  contractId,
}) => {
  const trackEvent = useTrack();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ExtraPublishMetadata>();
  const logoUrl = useImageFileOrUrl(watch("logo"));

  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully released contract",
    "Failed to released contract",
  );
  const address = useAddress();
  const publishMutation = usePublishMutation();
  const showProxyDeployment = router.query.proxyDeploy === "true";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const publishMetadata = useContractPublishMetadataFromURI(contractId);
  const prePublishMetadata = useContractPrePublishMetadata(contractId, address);

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

  const latestVersion =
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .version;

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      const versplit = latestVersion.split(".");
      return `${versplit[0]}.${versplit[1]}.${Number(versplit[2]) + 1}`;
    }
    return "1.0.0";
  }, [latestVersion]);

  useEffect(() => {
    if (!isDirty && address) {
      reset({
        ...prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata,
        changelog: "",
        version: placeholderVersion,
        description:
          prePublishMetadata.data?.latestPublishedContractMetadata
            ?.publishedMetadata.description ||
          prePublishMetadata.data?.preDeployMetadata.info.title ||
          "",
        factoryDeploymentData: prePublishMetadata.data
          ?.latestPublishedContractMetadata?.publishedMetadata
          ?.factoryDeploymentData || {
          factoryAddresses: Object.fromEntries(
            SUPPORTED_CHAIN_IDS.map((id) => [
              id,
              CONTRACT_ADDRESSES[id].twFactory,
            ]),
          ),
          implementationAddresses: Object.fromEntries(
            SUPPORTED_CHAIN_IDS.map((id) => [id, ""]),
          ),
          implementationInitializerFunction: "initialize",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePublishMetadata.data, address, placeholderVersion, isDirty]);

  const ensQuery = ens.useQuery(address);

  const ensNameOrAddress = useMemo(() => {
    return ensQuery?.data?.ensName || ensQuery.data?.address;
  }, [ensQuery.data]);

  const successRedirectUrl = useMemo(() => {
    if (!ensNameOrAddress || !publishMetadata.data?.name) {
      return undefined;
    }
    return `/${ensNameOrAddress}/${publishMetadata.data.name}`;
  }, [ensNameOrAddress, publishMetadata.data?.name]);

  const isDisabled = !successRedirectUrl || !address;
  const isDeployableViaFactory = watch("isDeployableViaFactory");

  // during loading and after success we should stay in loading state
  const isLoading = publishMutation.isLoading || publishMutation.isSuccess;

  return (
    <Card w="100%" p={{ base: 6, md: 10 }}>
      <Flex
        as="form"
        id="contract-release-form"
        onSubmit={handleSubmit((data) => {
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
              extraMetadata: data,
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
                });
                if (successRedirectUrl) {
                  router.push(
                    successRedirectUrl,
                    undefined,
                    // reset scroll after redirect
                    // shallow render (aka do not wait for SSR)
                    { scroll: true, shallow: true },
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
                });
              },
            },
          );
        })}
        direction="column"
        gap={6}
      >
        <Flex gap={8} direction="column">
          <Flex gap={4} alignItems="center">
            <FormControl isInvalid={!!errors.logo} w="auto">
              <Box width={{ base: "auto", md: "90px" }}>
                <FileInput
                  accept={{ "image/*": [] }}
                  value={logoUrl}
                  setValue={(file) => setValue("logo", file)}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  transition="all 200ms ease"
                  _hover={{ shadow: "sm" }}
                  renderPreview={(fileUrl) => (
                    <Image
                      w="100%"
                      h="100%"
                      src={replaceIpfsUrl(fileUrl)}
                      borderRadius="full"
                    />
                  )}
                  helperText="logo"
                  isDisabled={isDisabled}
                />
              </Box>
              <FormErrorMessage>
                {errors?.logo?.message as unknown as string}
              </FormErrorMessage>
            </FormControl>

            <Flex direction="column">
              <Skeleton
                isLoaded={
                  publishMetadata.isSuccess && !!publishMetadata.data.name
                }
              >
                <Heading minW="60px" size="title.md" fontWeight="bold">
                  {publishMetadata.data?.name || "Placeholder"}
                </Heading>
              </Skeleton>
              {address ? (
                <Text size="body.md" py={1}>
                  Releasing as{" "}
                  <strong>
                    {shortenIfAddress(ensQuery.data?.ensName || address)}
                  </strong>
                </Text>
              ) : (
                <Text size="body.md" py={1}>
                  Connect your wallet to create a release for this contract
                </Text>
              )}
            </Flex>
          </Flex>
          <FormControl isInvalid={!!errors.Description}>
            <FormLabel>Description</FormLabel>
            <Input {...register("description")} disabled={isDisabled} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.readme}>
            <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
              <TabList
                px={0}
                borderBottomColor="borderColor"
                borderBottomWidth="1px"
              >
                <Tab gap={2}>
                  <Icon as={BsCode} my={2} />
                  <Heading size="label.lg">About</Heading>
                </Tab>
                <Tab gap={2}>
                  <Icon as={BsEye} my={2} />
                  <Heading size="label.lg">Preview</Heading>
                </Tab>
              </TabList>
              <TabPanels pt={2}>
                <TabPanel px={0} pb={0}>
                  <Textarea
                    {...register("readme")}
                    disabled={isDisabled}
                    rows={12}
                  />
                  <FormErrorMessage>{errors?.readme?.message}</FormErrorMessage>
                </TabPanel>
                <TabPanel px={0} pb={0}>
                  <Card>
                    <MarkdownRenderer markdownText={watch("readme") || ""} />
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.version}>
            <Flex alignItems="center" mb={1}>
              <FormLabel flex="1" mb={0}>
                Version
              </FormLabel>
              {latestVersion && (
                <Text size="body.md">latest release: {latestVersion}</Text>
              )}
            </Flex>
            <Input
              {...register("version")}
              placeholder={placeholderVersion}
              disabled={isDisabled}
            />
            <FormErrorMessage>{errors?.version?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.audit}>
            <FormLabel>Audit</FormLabel>
            {watch("audit") instanceof File ? (
              <InputGroup>
                <Input isDisabled value={watch("audit")?.name} />
                <InputRightElement>
                  <Icon
                    as={FiTrash}
                    cursor="pointer"
                    color="red.300"
                    _hover={{ color: "red.200" }}
                    onClick={() => setValue("audit", "")}
                  />
                </InputRightElement>
              </InputGroup>
            ) : (
              <InputGroup>
                <Input
                  {...register("audit")}
                  placeholder="ipfs://..."
                  isDisabled={isDisabled}
                />
                <InputRightElement pointerEvents={isDisabled ? "none" : "auto"}>
                  <Tooltip label="Upload file" shouldWrapChildren>
                    <FileInput
                      setValue={(file) => {
                        setValue("audit", file);
                      }}
                      isDisabled={isDisabled}
                    >
                      <Icon
                        as={FiUpload}
                        color="gray.600"
                        _hover={{ color: "gray.500" }}
                      />
                    </FileInput>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
            )}
            <FormHelperText>
              <Text size="body.sm">
                You can add a IPFS hash or URL pointing to an audit report, or
                add a file and we&apos;ll upload it to IPFS.
              </Text>
            </FormHelperText>
          </FormControl>
          {latestVersion && (
            <FormControl isInvalid={!!errors.changelog}>
              <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
                <TabList
                  px={0}
                  borderBottomColor="borderColor"
                  borderBottomWidth="1px"
                >
                  <Tab gap={2}>
                    <Icon as={BsCode} my={2} />
                    <Heading size="label.lg">Release notes</Heading>
                  </Tab>
                  <Tab gap={2}>
                    <Icon as={BsEye} my={2} />
                    <Heading size="label.lg">Preview</Heading>
                  </Tab>
                </TabList>
                <TabPanels pt={2}>
                  <TabPanel px={0} pb={0}>
                    <Textarea
                      {...register("changelog")}
                      disabled={isDisabled}
                    />
                    <FormErrorMessage>
                      {errors?.changelog?.message}
                    </FormErrorMessage>
                  </TabPanel>
                  <TabPanel px={0} pb={0}>
                    <Card>
                      <MarkdownRenderer
                        markdownText={watch("changelog") || ""}
                      />
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </FormControl>
          )}
          {showProxyDeployment && (
            <Flex alignItems="center" gap={3}>
              <Checkbox
                {...register("isDeployableViaFactory")}
                isChecked={isDeployableViaFactory}
              />
              <Flex gap={4} alignItems="center">
                <Heading size="label.lg">Deployable via factory</Heading>
                <Text>
                  Enable cheaper deploys for your users by using proxies of
                  pre-deployed contracts
                </Text>
              </Flex>
            </Flex>
          )}
          {showProxyDeployment && isDeployableViaFactory && (
            <Flex flexDir={"column"} gap={2}>
              <Heading size="label.lg">
                Addresses of your deployed implementations
              </Heading>
              <Text>
                Factory deployment requires having deployed implementations of
                your contract already available on each chain you want to
                support.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={8}>
                {SUPPORTED_CHAIN_IDS.map((chainId) => (
                  <FormControl key={`implementation${chainId}`}>
                    <FormLabel flex="1">
                      {SupportedChainIdToNetworkMap[chainId]}
                    </FormLabel>
                    <Flex gap={2}>
                      <Input
                        {...register(
                          `factoryDeploymentData.implementationAddresses.${chainId}`,
                        )}
                        placeholder="0x..."
                        disabled={isDisabled}
                      />
                      <DeployFormDrawer
                        contractId={contractId}
                        chainId={chainId}
                        onSuccessCallback={(contractAddress) => {
                          setValue(
                            `factoryDeploymentData.implementationAddresses.${chainId}`,
                            contractAddress,
                          );
                        }}
                        onDrawerVisibilityChanged={(visible) => {
                          setIsDrawerOpen(visible);
                        }}
                      />
                    </Flex>
                  </FormControl>
                ))}
              </SimpleGrid>
              <Heading size="label.lg" mt={8}>
                Initializer function
              </Heading>
              <Text>
                Choose the initializer function to invoke on your proxy
                contracts.
              </Text>
              <FormControl>
                {/** TODO this should be a selector of ABI functions **/}
                <Input
                  {...register(
                    `factoryDeploymentData.implementationInitializerFunction`,
                  )}
                  placeholder="function name to invoke"
                  defaultValue="initialize"
                  disabled={isDisabled}
                />
              </FormControl>
              <Heading size="label.lg" mt={8}>
                Addresses of your factory contracts
              </Heading>
              <Text>
                Enter the addresses of your deployed factory contracts. These
                need to conform to a known interface for deploying proxy
                contracts.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={8}>
                {SUPPORTED_CHAIN_IDS.map((chainId) => (
                  <FormControl key={`factory${chainId}`}>
                    <FormLabel flex="1">
                      {SupportedChainIdToNetworkMap[chainId]}
                    </FormLabel>
                    <Input
                      {...register(
                        `factoryDeploymentData.factoryAddresses.${chainId}`,
                      )}
                      placeholder="0x..."
                      disabled={isDisabled}
                    />
                  </FormControl>
                ))}
              </SimpleGrid>
            </Flex>
          )}
          <Flex justifyContent="space-between" alignItems="center">
            <Text>
              Our contract registry lives on-chain (Polygon), releasing is free
              (gasless).{" "}
              <LinkButton
                size="sm"
                variant="outline"
                href="https://portal.thirdweb.com/release"
                isExternal
              >
                Learn more
              </LinkButton>
            </Text>
            <Button
              borderRadius="md"
              position="relative"
              role="group"
              colorScheme={address ? "purple" : "blue"}
              isDisabled={isDisabled}
              isLoading={isLoading}
              form="contract-release-form"
              loadingText={
                publishMutation.isSuccess
                  ? "Preparing page"
                  : "Releasing contract"
              }
              type="submit"
            >
              Create Release
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
