import { ContractPublisher, replaceDeployerAddress } from "../publisher";
import {
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { QueryClient } from "@tanstack/query-core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Polygon } from "@thirdweb-dev/chains";
import { ensQuery } from "components/contract-components/hooks";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK, replaceIpfsUrl } from "lib/sdk";
import { useMemo } from "react";
import { BsShieldCheck } from "react-icons/bs";
import invariant from "tiny-invariant";
import { Card, Heading, Link, Text, TrackedLink, Badge } from "tw-components";

interface ContractCardProps {
  publisher: string;
  contractId: string;
  version?: string;
  tracking?: {
    source: string;
    itemIndex: `${number}`;
  };
}

export const ContractCard: React.FC<ContractCardProps> = ({
  publisher,
  contractId,
  version = "latest",
  tracking,
}) => {
  const publishedContractResult = usePublishedContract(
    `${publisher}/${contractId}/${version}`,
  );

  const isNewContract = useMemo(() => {
    const newContracts = ["thirdweb.eth/AccountFactory"];
    return newContracts.includes(`${publisher}/${contractId}`);
  }, [publisher, contractId]);

  const showSkeleton =
    publishedContractResult.isLoading ||
    publishedContractResult.isPlaceholderData;

  const href = useMemo(() => {
    let h: string;
    if (version !== "latest") {
      h = `/${publisher}/${contractId}/${version}`;
    } else {
      h = `/${publisher}/${contractId}`;
    }

    return replaceDeployerAddress(h);
  }, [contractId, publisher, version]);

  return !publishedContractResult.isLoading &&
    !publishedContractResult.data?.id ? null : (
    <LinkBox as="article">
      <Card
        h="full"
        p={4}
        role="group"
        as={Flex}
        flexDirection="column"
        borderColor="borderColor"
        transition="150ms border-color ease-in-out"
        _hover={{
          _dark: {
            borderColor: "blue.400",
          },
          _light: {
            borderColor: "blue.600",
          },
        }}
        overflow="hidden"
        bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
        gap={3}
        flexDir="column"
      >
        <Flex justifyContent="space-between">
          <Flex
            align="center"
            gap={1}
            color="rgba(255,255,255,.7)"
            _light={{ color: "rgba(0,0,0,.6)" }}
          >
            {(showSkeleton || publishedContractResult.data?.audit) && (
              <Flex
                isExternal
                as={Link}
                align="center"
                gap={0}
                href={replaceIpfsUrl(publishedContractResult.data?.audit || "")}
                _dark={{
                  color: "green.300",
                }}
                _light={{
                  color: "green.600",
                }}
              >
                <Skeleton boxSize={5} isLoaded={!showSkeleton}>
                  <Icon as={BsShieldCheck} />
                </Skeleton>
                <Skeleton isLoaded={!showSkeleton}>
                  <Text color="inherit" size="label.sm" fontWeight={500}>
                    Audited
                  </Text>
                </Skeleton>
              </Flex>
            )}
            {showSkeleton ||
              (publishedContractResult.data?.version &&
                publishedContractResult.data?.audit && (
                  <Text size="label.sm">·</Text>
                ))}
            {(showSkeleton || publishedContractResult.data?.version) && (
              <Flex align="center" gap={0.5}>
                <Skeleton isLoaded={!showSkeleton}>
                  <Text color="inherit" size="label.sm" fontWeight={500}>
                    v{publishedContractResult.data?.version}
                  </Text>
                </Skeleton>
              </Flex>
            )}
          </Flex>
          {isNewContract && (
            <Flex>
              <Badge
                alignSelf="center"
                borderRadius="xl"
                px={2}
                py={1.5}
                textTransform="capitalize"
              >
                New
              </Badge>
            </Flex>
          )}
        </Flex>

        <Flex direction="column" gap={4}>
          <Skeleton
            noOfLines={1}
            isLoaded={!showSkeleton}
            w={showSkeleton ? "50%" : "auto"}
          >
            <LinkOverlay
              as={TrackedLink}
              category="contract_card"
              label={contractId}
              href={href}
              trackingProps={{
                publisher,
                contractId,
                version,
                ...(tracking || {}),
              }}
              _hover={{ textDecor: "none" }}
            >
              <Heading as="h3" noOfLines={1} size="label.lg">
                {publishedContractResult.data?.displayName ||
                  publishedContractResult.data?.name}
              </Heading>
            </LinkOverlay>
          </Skeleton>

          <SkeletonText
            isLoaded={!showSkeleton}
            spacing={3}
            noOfLines={2}
            my={showSkeleton ? 2 : 0}
          >
            <Text size="body.md" noOfLines={2}>
              {publishedContractResult.data?.description}
            </Text>
          </SkeletonText>
        </Flex>
        <Flex
          pt={3}
          mt="auto"
          justify="space-between"
          align="center"
          as="footer"
        >
          <ContractPublisher
            addressOrEns={publishedContractResult.data?.publisher}
            showSkeleton={showSkeleton}
          />
        </Flex>
      </Card>
    </LinkBox>
  );
};

// data fetching
export type PublishedContractId =
  | `${string}/${string}`
  | `${string}/${string}/${string}`;

async function publishedContractQueryFn(
  publisher: string,
  contractId: string,
  version = "latest",
  queryClient: QueryClient,
) {
  const polygonSdk = getEVMThirdwebSDK(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
  );

  const publisherEns = await queryClient.fetchQuery(ensQuery(publisher));
  // START prefill both publisher ens variations
  if (publisherEns.address) {
    queryClient.setQueryData(
      ensQuery(publisherEns.address).queryKey,
      publisherEns,
    );
  }
  if (publisherEns.ensName) {
    queryClient.setQueryData(
      ensQuery(publisherEns.ensName).queryKey,
      publisherEns,
    );
  }
  // END prefill both publisher ens variations
  invariant(publisherEns.address, "publisher address not found");
  const latestPublishedVersion = await polygonSdk
    .getPublisher()
    .getVersion(publisherEns.address, contractId, version);
  invariant(latestPublishedVersion, "no published version found");
  const contractInfo = await polygonSdk
    .getPublisher()
    .fetchPublishedContractInfo(latestPublishedVersion);
  return {
    ...latestPublishedVersion,
    ...contractInfo.publishedMetadata,

    publishedContractId: `${publisher}/${contractId}/${version}`,
  };
}

export function publishedContractQuery(
  publishedContractId: PublishedContractId,
  queryClient: QueryClient,
) {
  const [publisher, contractId, version] = publishedContractId.split("/");
  return {
    queryKey: ["published-contract", { publisher, contractId, version }],
    queryFn: () =>
      publishedContractQueryFn(publisher, contractId, version, queryClient),
    enabled: !!publisher || !!contractId,
    placeholderData: {
      publishedContractId,
      version: "0.0.0",
      name: "Loading...",
      description: "Loading...",
      publisher: "",
      audit: "",
      logo: "",
      extensions: [],
      id: "",
      metadataUri: "",
      timestamp: "",
      bytecodeUri: "",
    } as PublishedContract,
  };
}

export type PublishedContract = Awaited<
  ReturnType<typeof publishedContractQueryFn>
>;

export function usePublishedContract(publishedContractId: PublishedContractId) {
  const queryClient = useQueryClient();
  return useQuery(publishedContractQuery(publishedContractId, queryClient));
}
