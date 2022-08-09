import {
  ens,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  usePublishMutation,
} from "../hooks";
import { MarkdownRenderer } from "../released-contract/markdown-renderer";
import { ContractId } from "../types";
import {
  Flex,
  FormControl,
  Icon,
  Input,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ExtraPublishMetadata } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FeatureIconMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BsCode, BsEye } from "react-icons/bs";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
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
    formState: { errors, isDirty },
  } = useForm<ExtraPublishMetadata>();
  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully released contract",
    "Failed to released contract",
  );
  const address = useAddress();
  const publishMutation = usePublishMutation();

  const publishMetadata = useContractPublishMetadataFromURI(contractId);
  const prePublishMetadata = useContractPrePublishMetadata(contractId, address);

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
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePublishMetadata.data, address, placeholderVersion, isDirty]);

  const ensQuery = ens.useQuery(address);

  const successRedirectUrl = useMemo(() => {
    if (
      (!ensQuery.data?.ensName && !ensQuery.data?.address) ||
      !publishMetadata.data?.name
    ) {
      return undefined;
    }
    return `/contracts/${ensQuery.data.ensName || ensQuery.data.address}/${
      publishMetadata.data.name
    }`;
  }, [
    ensQuery.data?.address,
    ensQuery.data?.ensName,
    publishMetadata.data?.name,
  ]);

  const isDisabled = !successRedirectUrl || !address;

  // during loading and after success we should stay in loading state
  const isLoading = publishMutation.isLoading || publishMutation.isSuccess;
  return (
    <Card w="100%" p={{ base: 6, md: 10 }}>
      <Flex
        as="form"
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "publish",
            action: "click",
            label: "attempt",
            uris: contractId,
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
            <ChakraNextImage
              src={FeatureIconMap["custom"]}
              boxSize={14}
              alt=""
            />

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
                  <Textarea {...register("changelog")} disabled={isDisabled} />
                  <FormErrorMessage>
                    {errors?.changelog?.message}
                  </FormErrorMessage>
                </TabPanel>
                <TabPanel px={0} pb={0}>
                  <Card>
                    <MarkdownRenderer markdownText={watch("changelog") || ""} />
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </FormControl>
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
            <TransactionButton
              colorScheme={address ? "purple" : "blue"}
              transactionCount={1}
              isDisabled={isDisabled}
              isLoading={isLoading}
              loadingText={
                publishMutation.isSuccess
                  ? "Preparing page"
                  : "Releasing contract"
              }
              type="submit"
            >
              Create Release
            </TransactionButton>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
