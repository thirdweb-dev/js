import { DeployFormDrawer } from "../contract-deploy-form/drawer";
import {
  useConstructorParamsFromABI,
  useContractFullPublishMetadata,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  useEns,
  useFunctionParamsFromABI,
  usePublishMutation,
} from "../hooks";
import { MarkdownRenderer } from "../released-contract/markdown-renderer";
import { ContractId } from "../types";
import {
  Box,
  Code,
  Divider,
  Flex,
  FormControl,
  GridItem,
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
} from "@thirdweb-dev/sdk/evm";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { getTemplateValuesForType } from "lib/deployment/tempalte-values";
import { replaceIpfsUrl } from "lib/sdk";
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
  Link,
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
    "Failed to release contract",
  );
  const address = useAddress();
  const publishMutation = usePublishMutation();
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
        displayName:
          prePublishMetadata.data?.latestPublishedContractMetadata
            ?.publishedMetadata.displayName ||
          prePublishMetadata.data?.preDeployMetadata.info.title ||
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
        constructorParams:
          prePublishMetadata.data?.latestPublishedContractMetadata
            ?.publishedMetadata?.constructorParams || {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePublishMetadata.data, address, placeholderVersion, isDirty]);

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

  const isDisabled = !successRedirectUrl || !address;
  const isDeployableViaFactory = watch("isDeployableViaFactory");
  const isDeployableViaProxy = watch("isDeployableViaProxy");

  const fullReleaseMetadata = useContractFullPublishMetadata(contractId);
  const constructorParams = useConstructorParamsFromABI(
    publishMetadata.data?.abi,
  );
  const initializerParams = useFunctionParamsFromABI(
    publishMetadata.data?.abi,
    fullReleaseMetadata.data?.factoryDeploymentData
      ?.implementationInitializerFunction || "initialize",
  );

  const deployParams = watch("isDeployableViaProxy")
    ? initializerParams
    : constructorParams;

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
                  is_proxy: data.isDeployableViaProxy,
                  is_factory: data.isDeployableViaFactory,
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
                      alt=""
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
          <FormControl isInvalid={!!errors.displayName}>
            <FormLabel>Release Name</FormLabel>
            <Input {...register("displayName")} disabled={isDisabled} />
            <FormErrorMessage>{errors?.displayName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.description}>
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
          <Divider />
          <Heading size="subtitle.lg">Advanced Settings</Heading>
          <Flex alignItems="center" gap={4}>
            <Checkbox
              {...register("isDeployableViaProxy")}
              isChecked={isDeployableViaProxy}
            />
            <Flex gap={1} alignItems="left" flexDir={"column"}>
              <Heading size="label.lg">Deployable via proxy</Heading>
              <Text>
                Enable cheaper deploys for your users by using proxies of
                pre-deployed contracts
              </Text>
            </Flex>
          </Flex>
          {deployParams?.length > 0 && (
            <>
              <Divider />
              <Flex flexDir="column" gap={2}>
                <Heading size="subtitle.md">Contract Parameters</Heading>
                <Text>
                  These are the parameters users will need to fill inwhen
                  deploying this contract.
                </Text>
                <Flex flexDir="column" gap={4}>
                  {deployParams.map((param) => {
                    const paramTemplateValues = getTemplateValuesForType(
                      param.type,
                    );
                    return (
                      <Flex
                        flexDir="column"
                        gap={1}
                        key={`implementation_${param.name}`}
                      >
                        <Flex justify="space-between" align="center">
                          <Heading size="subtitle.sm">{param.name}</Heading>
                          <Text size="body.sm">{param.type}</Text>
                        </Flex>
                        <SimpleGrid as={Card} gap={4} columns={12}>
                          <GridItem
                            as={FormControl}
                            colSpan={{ base: 12, md: 6 }}
                          >
                            <FormLabel
                              flex="1"
                              as={Text}
                              size="label.sm"
                              fontWeight={500}
                            >
                              Title
                            </FormLabel>
                            <Input
                              {...register(
                                `constructorParams.${param.name}.displayName`,
                              )}
                              placeholder={param.name}
                              disabled={isDisabled}
                            />
                          </GridItem>
                          <GridItem
                            as={FormControl}
                            colSpan={{ base: 12, md: 6 }}
                          >
                            <FormLabel
                              flex="1"
                              as={Text}
                              size="label.sm"
                              fontWeight={500}
                            >
                              Default Value
                            </FormLabel>

                            <Input
                              {...register(
                                `constructorParams.${param.name}.defaultValue`,
                              )}
                              disabled={isDisabled}
                            />

                            <FormHelperText>
                              This value will be pre-filled in the deploy form.
                              {paramTemplateValues.length > 0 && (
                                <Flex
                                  as={Card}
                                  mt={3}
                                  borderRadius="md"
                                  py={3}
                                  px={3}
                                  direction="column"
                                  gap={2}
                                >
                                  <Heading as="h5" size="label.sm">
                                    Supported template variables
                                  </Heading>
                                  <Flex direction="column">
                                    {paramTemplateValues.map((val) => (
                                      <Text size="body.sm" key={val.value}>
                                        <Code
                                          as="button"
                                          type="button"
                                          display="inline"
                                          onClick={() => {
                                            setValue(
                                              `constructorParams.${param.name}.defaultValue`,
                                              val.value,
                                            );
                                          }}
                                        >
                                          {val.value}
                                        </Code>{" "}
                                        - {val.helperText}
                                      </Text>
                                    ))}
                                  </Flex>
                                </Flex>
                              )}
                            </FormHelperText>
                          </GridItem>
                          <GridItem as={FormControl} colSpan={12}>
                            <FormLabel
                              flex="1"
                              as={Text}
                              size="label.sm"
                              fontWeight={500}
                            >
                              Description
                            </FormLabel>
                            <Textarea
                              {...register(
                                `constructorParams.${param.name}.description`,
                              )}
                              disabled={isDisabled}
                            />
                          </GridItem>
                        </SimpleGrid>
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>
            </>
          )}
          {isDeployableViaProxy && (
            <Flex flexDir={"column"} gap={2}>
              <Heading size="subtitle.md">Proxy Settings</Heading>
              <Heading size="label.lg">
                Addresses of your deployed implementations
              </Heading>
              <Text>
                Proxy deployment requires having deployed implementations of
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
              <Flex alignItems="center" gap={4} mt={8}>
                <Checkbox
                  {...register("isDeployableViaFactory")}
                  isChecked={isDeployableViaFactory}
                />
                <Flex gap={1} alignItems="left" flexDir={"column"}>
                  <Heading size="label.lg" flexShrink={0}>
                    Deployable via factory (optional)
                  </Heading>
                  <Text>
                    Use a factory contract to deploy clones of your
                    implementation contracts using your custom logic.
                  </Text>
                </Flex>
              </Flex>
              {isDeployableViaFactory && (
                <>
                  <Heading size="label.lg" mt={8}>
                    Addresses of your factory contracts
                  </Heading>
                  <Text>
                    Enter the addresses of your deployed factory contracts.
                    These need to conform to the{" "}
                    <Link href="https://portal.thirdweb.com/contracts/IContractFactory">
                      IContractFactory interface.
                    </Link>
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
                </>
              )}
            </Flex>
          )}
          <Divider />
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
