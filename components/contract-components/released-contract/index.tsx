import {
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
  useEnsName,
  useReleasedContractCompilerMetadata,
  useReleasedContractFunctions,
  useReleasedContractInfo,
} from "../hooks";
import { ReleaserHeader } from "../releaser/releaser-header";
import { ContractFunctionsPanel } from "./extracted-contract-functions";
import { SourcesPanel } from "./sources-panel";
import {
  Box,
  Divider,
  Flex,
  GridItem,
  Icon,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useClipboard,
} from "@chakra-ui/react";
import { PublishedContract } from "@thirdweb-dev/sdk";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { BiPencil, BiShareAlt } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { IoDocumentOutline } from "react-icons/io5";
import { SiTwitter } from "react-icons/si";
import { VscSourceControl } from "react-icons/vsc";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export interface ExtendedReleasedContractInfo extends PublishedContract {
  name: string;
  description: string;
  version: string;
  releaser: string;
}

interface ReleasedContractProps {
  release: ExtendedReleasedContractInfo;
  walletOrEns: string;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
  walletOrEns,
}) => {
  const releasedContractInfo = useReleasedContractInfo(release);
  const { data: compilerInfo } = useReleasedContractCompilerMetadata(release);

  const router = useRouter();
  const contractReleaseMetadata = useContractPublishMetadataFromURI(
    release.metadataUri,
  );

  const enabledExtensions = useContractEnabledExtensions(
    contractReleaseMetadata.data?.abi,
  );

  const currentRoute = `https://thirdweb.com${router.asPath}`.replace(
    "/latest",
    "",
  );

  const { data: contractFunctions } = useReleasedContractFunctions(release);

  const { onCopy, hasCopied } = useClipboard(currentRoute);

  const ensName = useEnsName(release.releaser);

  const releaserEnsOrAddress = ensName.data || release.releaser;

  const ogImageUrl = useMemo(() => {
    const url = new URL("https://og-image.thirdweb.com/thirdweb");
    url.searchParams.append("version", release.version);
    url.searchParams.append("description", release.description);
    url.searchParams.append("contractName", release.name);
    if (compilerInfo?.licenses) {
      compilerInfo.licenses.forEach((license) => {
        url.searchParams.append("licenses", license);
      });
    }
    if (enabledExtensions) {
      enabledExtensions
        .map((extension) => extension.name)
        .forEach((extension) => {
          url.searchParams.append("extensions", extension);
        });
    }
    url.searchParams.append("releaser", releaserEnsOrAddress);
    return `${url.href}&.png`;
  }, [release, compilerInfo, enabledExtensions, releaserEnsOrAddress]);

  return (
    <>
      <NextSeo
        title={release.name}
        description={`${release.description}${
          release.description ? ". " : ""
        }Deploy ${release.name} in one click with thirdweb.`}
        openGraph={{
          title: `${shortenIfAddress(releaserEnsOrAddress)}/${release.name}`,
          url: currentRoute,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 650,
              alt: "thirdweb",
            },
          ],
        }}
      />
      <GridItem order={{ base: 4, md: 3 }} colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {releasedContractInfo.data?.publishedMetadata?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={0}>
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
            <Card as={Flex} flexDir="column" gap={2} p={0}>
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
          <Card as={Flex} flexDir="column" gap={2} p={0}>
            <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
              <TabList
                px={0}
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
                  <ContractFunctionsPanel
                    functions={(contractFunctions || []).filter(
                      (f) =>
                        f.stateMutability !== "view" &&
                        f.stateMutability !== "pure",
                    )}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <ContractFunctionsPanel
                    functions={(contractFunctions || []).filter(
                      (f) =>
                        f.stateMutability === "view" ||
                        f.stateMutability === "pure",
                    )}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <SourcesPanel
                    release={release}
                    contractReleaseMetadata={contractReleaseMetadata.data}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </Flex>
      </GridItem>
      <GridItem order={{ base: 3, md: 4 }} colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {walletOrEns && <ReleaserHeader wallet={walletOrEns} />}
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
              {(enabledExtensions || []).map((feature) => (
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
                  <Icon
                    boxSize={5}
                    as={hasCopied ? IoMdCheckmark : BiShareAlt}
                  />
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
      </GridItem>
    </>
  );
};
