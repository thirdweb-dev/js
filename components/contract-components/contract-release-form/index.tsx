import {
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  useEnsName,
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
  Text,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ContractReleaseFormProps {
  contractId: ContractId;
}

export const ContractReleaseForm: React.FC<ContractReleaseFormProps> = ({
  contractId,
}) => {
  const { trackEvent } = useTrack({
    page: "publish",
  });
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

  useEffect(() => {
    if (!isDirty && address) {
      reset({
        ...prePublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata,
        changelog: "",
        version: "",
        description:
          prePublishMetadata.data?.latestPublishedContractMetadata
            ?.publishedMetadata.description ||
          prePublishMetadata.data?.preDeployMetadata.info.title ||
          "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePublishMetadata.data, address]);

  const latestVersion =
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .version;

  const ensName = useEnsName(address);

  const placeholderVersion = useMemo(() => {
    if (latestVersion) {
      return `${latestVersion.split(".")[0]}.${latestVersion.split(".")[1]}.${
        Number(latestVersion.split(".")[2]) + 1
      }`;
    }
    return "1.0.0";
  }, [latestVersion]);

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
            { predeployUri: contractId, extraMetadata: data },
            {
              onSuccess: () => {
                onSuccess();
                trackEvent({
                  category: "publish",
                  action: "click",
                  label: "success",
                  uris: contractId,
                });
                router.push(
                  `/contracts/${ensName.data || address}/${
                    publishMetadata.data?.name
                  }`,
                );
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
            <Skeleton isLoaded={publishMetadata.isSuccess}>
              <Flex direction="column">
                <Heading minW="60px" size="title.md" fontWeight="bold">
                  {publishMetadata.data?.name}
                </Heading>
                {address ? (
                  <Text size="body.md" py={1}>
                    Releasing as{" "}
                    <strong>{shortenIfAddress(ensName.data || address)}</strong>
                  </Text>
                ) : (
                  <Text size="body.md" py={1}>
                    Connect your wallet to create a release for this contract
                  </Text>
                )}
              </Flex>
            </Skeleton>
          </Flex>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Description</FormLabel>
            <Input {...register("description")} disabled={!address} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.name}>
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
                    disabled={!address}
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

          <FormControl isRequired isInvalid={!!errors.name}>
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
              disabled={!address}
            />
            <FormErrorMessage>{errors?.version?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
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
                  <Textarea {...register("changelog")} disabled={!address} />
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
              Our contract registry lives on Polygon and releases are free
              (gasless)
            </Text>
            <TransactionButton
              colorScheme={address ? "purple" : "blue"}
              transactionCount={1}
              isLoading={publishMutation.isLoading}
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
