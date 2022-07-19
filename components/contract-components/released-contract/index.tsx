import {
  useContractEnabledFeatures,
  useContractPublishMetadataFromURI,
  useReleasedContractCompilerMetadata,
  useReleasedContractFunctions,
  useReleasedContractInfo,
} from "../hooks";
import { ReleaserHeader } from "../releaser/releaser-header";
import { ContractFunction } from "./extracted-contract-functions";
import {
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  List,
  ListItem,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useClipboard,
} from "@chakra-ui/react";
import {
  PublishedContract,
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@thirdweb-dev/sdk";
import { StorageSingleton } from "components/app-layouts/providers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { BiPencil, BiShareAlt } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { FiXCircle } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { IoDocumentOutline } from "react-icons/io5";
import { SiTwitter } from "react-icons/si";
import { VscSourceControl } from "react-icons/vsc";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import {
  Card,
  CodeBlock,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";

interface ReleasedContractProps {
  release: PublishedContract;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
}) => {
  const releasedContractInfo = useReleasedContractInfo(release);
  const { data: compilerInfo } = useReleasedContractCompilerMetadata(release);

  const wallet = useSingleQueryParam("wallet");
  const router = useRouter();
  const contractReleaseMetadata = useContractPublishMetadataFromURI(
    release.metadataUri,
  );

  const enabledFeatures = useContractEnabledFeatures(
    contractReleaseMetadata.data?.abi,
  );
  const sources = useQuery(
    ["sources", release],
    async () => {
      invariant(
        contractReleaseMetadata.data?.compilerMetadata?.sources,
        "no compilerMetadata sources available",
      );
      return (
        await fetchSourceFilesFromMetadata(
          {
            metadata: {
              sources: contractReleaseMetadata.data.compilerMetadata.sources,
            },
          } as unknown as PublishedMetadata,
          StorageSingleton,
        )
      )
        .filter((source) => !source.filename.includes("@"))
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        });
    },
    { enabled: !!contractReleaseMetadata.data?.compilerMetadata?.sources },
  );
  const currentRoute = `https://thirdweb.com${router.asPath}`;

  const { data: contractFunctions } = useReleasedContractFunctions(release);

  const { onCopy, hasCopied } = useClipboard(currentRoute);
  return (
    <Flex gap={12} w="full" flexDir={{ base: "column-reverse", md: "row" }}>
      <NextSeo
        title={`${releasedContractInfo.data?.name} | Deploy in one click with thirdweb deploy`}
        description={`Browse previous versions of ${releasedContractInfo.data?.name} and deploy it in one click to any supported blockchains.`}
        openGraph={{
          title: `${releasedContractInfo.data?.name} | Deploy in one click with thirdweb deploy`,
          url: currentRoute,
        }}
      />
      <Flex w="full" flexDir="column" gap={6}>
        {releasedContractInfo.data?.publishedMetadata?.readme && (
          <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
            <Heading px={6} pt={5} pb={2} size="title.sm">
              Readme
            </Heading>
            <Divider />
            <Text px={6} pt={2} pb={5} whiteSpace="pre-wrap">
              {releasedContractInfo.data?.publishedMetadata.readme}
            </Text>
          </Card>
        )}
        {releasedContractInfo.data?.publishedMetadata?.changelog && (
          <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
            <Heading px={6} pt={5} pb={2} size="title.sm">
              {releasedContractInfo.data?.publishedMetadata?.version} Release
              Notes
            </Heading>
            <Divider />
            <Text px={6} pt={2} pb={5} whiteSpace="pre-wrap">
              {releasedContractInfo.data?.publishedMetadata?.changelog}
            </Text>
          </Card>
        )}
        <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
          <Tabs colorScheme="purple">
            <TabList
              px={{ base: 2, md: 6 }}
              borderBottomColor="borderColor"
              borderBottomWidth="1px"
            >
              <Tab gap={2}>
                <Icon as={BiPencil} my={2} />
                <Heading size="label.lg">
                  <Box as="span" display={{ base: "none", md: "flex" }}>
                    Functions
                  </Box>
                  <Box as="span" display={{ base: "flex", md: "none" }}>
                    Func
                  </Box>
                </Heading>
              </Tab>
              <Tab gap={2}>
                <Icon as={BsEye} my={2} />
                <Heading size="label.lg">
                  <Box as="span" display={{ base: "none", md: "flex" }}>
                    Variables
                  </Box>
                  <Box as="span" display={{ base: "flex", md: "none" }}>
                    Var
                  </Box>
                </Heading>
              </Tab>
              <Tab gap={2}>
                <Icon as={VscSourceControl} my={2} />
                <Heading size="label.lg">
                  <Box as="span" display={{ base: "none", md: "flex" }}>
                    Sources
                  </Box>
                  <Box as="span" display={{ base: "flex", md: "none" }}>
                    Src
                  </Box>
                </Heading>
              </Tab>
            </TabList>
            <TabPanels px={{ base: 2, md: 6 }} py={2}>
              <TabPanel px={0}>
                <Flex flexDir="column" flex="1" gap={3}>
                  {(contractFunctions || [])
                    .filter(
                      (f) =>
                        f.stateMutability !== "view" &&
                        f.stateMutability !== "pure",
                    )
                    .map((fn) => (
                      <ContractFunction key={fn.name} fn={fn} />
                    ))}
                </Flex>
              </TabPanel>
              <TabPanel px={0}>
                <Flex flexDir="column" flex="1" gap={3}>
                  {(contractFunctions || [])
                    .filter(
                      (f) =>
                        f.stateMutability === "view" ||
                        f.stateMutability === "pure",
                    )
                    .map((fn) => (
                      <ContractFunction key={fn.signature} fn={fn} />
                    ))}
                </Flex>
              </TabPanel>
              <TabPanel px={0}>
                {sources.isLoading ? (
                  <Card>
                    <Center>
                      <Spinner mr={4} /> Loading sources...
                    </Center>
                  </Card>
                ) : sources.data && sources.data.length > 0 ? (
                  <Flex direction="column" gap={8}>
                    {sources.data.map((signature) => (
                      <Flex
                        gap={4}
                        flexDirection="column"
                        key={signature.filename}
                      >
                        <Heading size="label.md">{signature.filename}</Heading>
                        <CodeBlock
                          code={signature.source}
                          language="solidity"
                        />
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Card>
                    <Flex direction="column" align="left" gap={2}>
                      <Flex direction="row" align="center" gap={2}>
                        <Icon as={FiXCircle} color="red.500" />
                        <Heading size="title.sm">
                          Contract source code not available
                        </Heading>
                      </Flex>
                      <Heading size="subtitle.sm">
                        Try deploying with{" "}
                        <Link
                          href="https://portal.thirdweb.com/thirdweb-deploy/thirdweb-cli"
                          isExternal
                        >
                          thirdweb CLI v0.5+
                        </Link>
                      </Heading>
                    </Flex>
                  </Card>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Flex>
      <Flex w={{ base: "100%", md: "18vw" }} flexDir="column" gap={6}>
        {wallet && <ReleaserHeader wallet={wallet} />}
        <Divider />
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Contract details</Heading>
          <List as={Flex} flexDir="column" gap={3}>
            <ListItem>
              <Flex gap={2} alignItems="center">
                <Icon as={IoDocumentOutline} boxSize={5} />
                <Text size="label.md">
                  License: {compilerInfo?.licenses?.join(", ") || "None"}
                </Text>
              </Flex>
            </ListItem>
            {(enabledFeatures || []).map((feature) => (
              <ListItem key={feature.name}>
                <Flex gap={2} alignItems="center">
                  <Icon as={FcCheckmark} boxSize={5} />
                  <Text size="label.md">{feature.name}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Flex>
        <Divider />
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Share</Heading>
          <Flex gap={2} alignItems="center">
            <TrackedIconButton
              bg="transparent"
              aria-label="copy-url"
              icon={
                <Icon boxSize={5} as={hasCopied ? IoMdCheckmark : BiShareAlt} />
              }
              category="released-contract"
              label="copy-url"
              onClick={onCopy}
            />
            <TrackedIconButton
              as={LinkButton}
              isExternal
              noIcon
              href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20${releasedContractInfo.data?.name}%20contract%20on%20%40thirdweb_%0A%0ADeploy%20it%20in%20one%20click%3A&url=${currentRoute}`}
              bg="transparent"
              aria-label="twitter"
              icon={<Icon boxSize={5} as={SiTwitter} />}
              category="released-contract"
              label="share-twitter"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
