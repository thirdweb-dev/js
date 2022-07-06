import {
  Flex,
  FormControl,
  Input,
  Link,
  Skeleton,
  Textarea,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ExtraPublishMetadata } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  usePublishMutation,
} from "components/contract-components/hooks";
import { FeatureIconMap, UrlMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

const ContractsPublishPageWrapped: React.FC = () => {
  const { Track, trackEvent } = useTrack({
    page: "publish",
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ExtraPublishMetadata>();

  const router = useRouter();
  const address = useAddress();

  const ipfsHashes = useMemo(() => {
    const uri = router.query.uri;
    const ipfs = router.query.ipfs;
    let array: string[] = [];
    // handle both ipfs and uri
    if (ipfs) {
      array = Array.isArray(ipfs) ? ipfs : [ipfs];
    } else if (uri) {
      array = (Array.isArray(uri) ? uri : [uri]).map((hash) =>
        hash.replace("ipfs://", ""),
      );
    }
    return array;
  }, [router.query]);

  const { onSuccess, onError } = useTxNotifications(
    "Successfully published contract",
    "Failed to publish contracts",
  );
  const publishMutation = usePublishMutation();

  const publishableContractId = useMemo(() => {
    return ipfsHashes.find((id) => !(id in UrlMap));
  }, [ipfsHashes]);

  const uri = useMemo(
    () =>
      publishableContractId?.startsWith("ipfs://")
        ? publishableContractId
        : `ipfs://${publishableContractId}`,
    [publishableContractId],
  );

  const publishMetadata = useContractPublishMetadataFromURI(uri);
  const prePublishMetadata = useContractPrePublishMetadata(uri, address);

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
          prePublishMetadata.data?.preDeployMetadata.info.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePublishMetadata.data, address]);

  const latestVersion =
    prePublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .version;

  return (
    <Track>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">Create a Release</Heading>
          <Text fontStyle="normal" maxW="container.lg">
            Releases are recorded on chain, and enable others to deploy this
            contract and track new versions.
            <br /> Unlocks automatic SDKs in all languages, admin dashboards,
            analytics and auto verification.{" "}
            <Link
              color="primary.500"
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/thirdweb-cli"
            >
              Learn more
            </Link>
          </Text>
        </Flex>
        <Card w="100%" p={8}>
          <Flex
            as="form"
            onSubmit={handleSubmit((data) => {
              trackEvent({
                category: "publish",
                action: "click",
                label: "attempt",
                uris: uri,
              });
              publishMutation.mutate(
                { predeployUri: uri, extraMetadata: data },
                {
                  onSuccess: () => {
                    onSuccess();
                    trackEvent({
                      category: "publish",
                      action: "click",
                      label: "success",
                      uris: uri,
                    });
                    router.push(`/contracts`);
                  },
                  onError: (err) => {
                    onError(err);
                    trackEvent({
                      category: "publish",
                      action: "click",
                      label: "error",
                      uris: uri,
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
                    <Text size="body.md" py={1}>
                      Releasing as {shortenIfAddress(address)}
                    </Text>
                  </Flex>
                </Skeleton>
              </Flex>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description")} disabled={!address} />
                <FormErrorMessage>
                  {errors?.description?.message}
                </FormErrorMessage>
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
                  placeholder={latestVersion || "1.0.0"}
                  disabled={!address}
                />
                <FormErrorMessage>{errors?.version?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Release Notes</FormLabel>
                <Textarea {...register("changelog")} disabled={!address} />
                <FormErrorMessage>
                  {errors?.changelog?.message}
                </FormErrorMessage>
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
      </Flex>
    </Track>
  );
};

export default function ContractsPublishPage() {
  return (
    <PublisherSDKContext>
      <ContractsPublishPageWrapped />
    </PublisherSDKContext>
  );
}

ContractsPublishPage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
