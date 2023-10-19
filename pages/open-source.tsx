import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  DarkMode,
  Flex,
  Icon,
  LinkBox,
  SimpleGrid,
} from "@chakra-ui/react";
import { Aurora } from "components/homepage/Aurora";
import { ProductPage } from "components/product-pages/common/ProductPage";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useTrack } from "hooks/analytics/useTrack";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { GetStaticProps } from "next";
import { PageId } from "page-id";
import { ReactNode } from "react";
import { BsGithub } from "react-icons/bs";
import { Heading, LinkButton, Text, TrackedLink } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";
import { ThirdwebNextPage } from "utils/types";

const filterOut = [
  "0xFirekeeper",
  "Abbas-Khann",
  "adam-maj",
  "arcoraven",
  "assimovt",
  "atbe",
  "atharvadeosthale",
  "avneesh0612",
  "ayshptk",
  "ciaranightingale",
  "eabdelmoneim",
  "farhanW3",
  "furqanrydhan",
  "iketw",
  "jakeloo",
  "jarrodwatts",
  "jnsdls",
  "joaquim-verges",
  "juandolealt",
  "JustinTime42",
  "kumaryash90",
  "MananTank",
  "Marfuen",
  "MGoldstein18",
  "nachoiacovino",
  "ndeto",
  "nessup",
  "nkrishang",
  "palerthanale",
  "rattrayd11",
  "razacodespython",
  "saminacodes",
  "shift4id",
  "warengonzaga",
];

const repositories = [
  {
    id: "contracts",
    name: "Contracts",
    description:
      "Solidity smart contracts that power our Solidity SDK and Explore.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description:
      "User interface to deploy, explore and interact with smart contracts.",
  },
  {
    id: "js",
    name: "JS Monorepo",
    description:
      "TypeScript, React and Wallet SDKs, CLI, Auth, Storage, and more.",
  },
  {
    id: "python-sdk",
    name: "Python SDK",
    description: "Create web3 backend applications using Python.",
  },
  {
    id: "unity-sdk",
    name: "Unity SDK",
    description: "Create web-based or native web3 games using Unity.",
  },
  {
    id: "go-sdk",
    name: "Go SDK",
    description: "Create web3 backend applications using Go.",
  },
  {
    id: "docs",
    name: "Portal",
    description: "Documentation, templates, and guides for developers.",
  },
  {
    id: "examples",
    url: "https://github.com/thirdweb-example",
    name: "Examples",
    description: "Explore example projects built with thirdweb.",
  },
  {
    id: "dynamic-contracts",
    name: "Dynamic Contracts",
    description:
      "Architectural pattern for writing dynamic smart contracts in Solidity.",
  },
];

const bounties = [
  {
    id: 0,
    title: "Gas Optimizations",
    description: (
      <>
        Gas optimization is a critical aspect of developing efficient and
        cost-effective smart contracts on blockchain platforms. This bounty aims
        to support optimizing gas usage for thirdweb&apos;s published smart
        contracts, enhancing their performance, scalability, and
        cost-effectiveness.
      </>
    ),
    status: "open",
    amount: "Up to $20,000",
    primaryButtonLink: "https://forms.gle/1GgRoMGqnCAZKZL29",
    primaryButtonText: "Submit Bounty",
    secondaryButtonLink:
      "https://thirdweb.notion.site/Gas-Optimization-for-thirdweb-published-contracts-85d811de893b4bb8814bd8bbbd488cff?pvs=4",
    secondaryButtonText: "Read Guidelines",
  },
  {
    id: 1,
    title: "Security Vulnerabilities",
    description: (
      <>
        Raise security vulnerability to our team using the guidelines outlined
        in our bug bounty document below.
      </>
    ),
    status: "open",
    amount: "Up to $25,000",
    primaryButtonLink: "https://forms.gle/1GgRoMGqnCAZKZL29",
    primaryButtonText: "Submit Bounty",
    secondaryButtonLink:
      "https://thirdweb.notion.site/thirdweb-Bug-Bounty-Program-f78d1db776ab4f0e974c9da176fcf706?pvs=4",
    secondaryButtonText: "Read Guidelines",
  },
];

interface RepoCardProps {
  title: string;
  description: ReactNode;
  url: string;
}

interface PageProps {
  contributors: GithubContributor[];
}

interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const orgNames = ["thirdweb-dev", "thirdweb-example"];

interface GithubRepository {
  id: number;
  name: string;
  fork: boolean;
  owner: { login: string };
}

const RepoCard: React.FC<RepoCardProps> = ({ title, description, url }) => {
  return (
    <LinkBox
      as="a"
      target="_blank"
      background="rgba(0,0,0,0.2)"
      boxShadow="0 0 0 1px hsl(0deg 0% 100% / 15%)"
      borderRadius="12px"
      padding={8}
      href={url}
      _hover={{
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
      transition="background-color 0.2s ease"
    >
      <Heading as="h3" fontSize="28px" mb={4} fontWeight={700}>
        {title}
      </Heading>
      <Text size="body.lg" lineHeight={1.7} color="#888">
        {description}
      </Text>
    </LinkBox>
  );
};

const OSS: ThirdwebNextPage = ({ contributors }: PageProps) => {
  const trackEvent = useTrack();

  return (
    <DarkMode>
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <ProductPage
          seo={{
            title: "Open Source Community",
            description:
              "All of our SDKs, infrastructure, and documentation are open source under the Apache 2.0 license and open to contributions.",
            openGraph: {
              images: [
                {
                  url: `${getAbsoluteUrl()}/assets/og-image/sdk.png`,
                  width: 2334,
                  height: 1260,
                  alt: "thirdweb Open Source SDKs",
                },
              ],
            },
          }}
        >
          <HomepageSection pt="100px" bottomPattern pb={32}>
            <Aurora
              pos={{ left: "50%", top: "0%" }}
              size={{ width: "2400px", height: "2400px" }}
              color="hsl(289deg 78% 30% / 45%)"
            />

            <Flex
              pt={24}
              mb={{ base: 24, md: -24 }}
              flexDir="column"
              gap={{ base: 6, md: 8 }}
              align={{ base: "initial", md: "start" }}
            >
              <Heading
                as="h2"
                size="display.md"
                textAlign={{ base: "center", md: "left" }}
              >
                Open Source
              </Heading>
              <Heading
                as="h3"
                size="subtitle.md"
                textAlign={{ base: "center", md: "left" }}
                maxW="container.sm"
              >
                All of our SDKs, infrastructure, and documentation are open
                source under the Apache 2.0 license and open to contributions.
              </Heading>

              <Flex
                flexDirection={{ base: "column", md: "row" }}
                gap={4}
                mt={{ base: 8, md: 0 }}
              >
                <Flex flexDir="column" gap={3} flexGrow={1} minW={300}>
                  <LinkButton
                    href="https://github.com/orgs/thirdweb-dev/"
                    isExternal
                    onClick={() =>
                      trackEvent({
                        category: "cta-button",
                        action: "click",
                        label: "oss",
                        title: "Contribute Now",
                      })
                    }
                    px={4}
                    py={7}
                    fontSize="20px"
                    leftIcon={<Icon as={BsGithub} color="black" />}
                    color="black"
                    flexShrink={0}
                    background="rgba(255,255,255,1)"
                    _hover={{
                      background: "rgba(255,255,255,0.9)!important",
                    }}
                    zIndex={12}
                  >
                    Contribute Now
                  </LinkButton>
                </Flex>
              </Flex>
            </Flex>
          </HomepageSection>
          <HomepageSection pb={32}>
            <Heading size="display.sm" mb={12}>
              Top Community Contributors
            </Heading>
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              gap={8}
              justifyContent="space-evenly"
            >
              {contributors.slice(0, 16).map((contributor) => (
                <Flex
                  key={contributor.login}
                  flexDir="row"
                  gap={2}
                  alignItems="center"
                >
                  <MaskedAvatar src={contributor.avatar_url} />
                  <Flex key={contributor.login} flexDir="column" gap={1}>
                    <TrackedLink
                      href={`https://github.com/${contributor.login}`}
                      isExternal
                      category="team"
                      label={contributor.login}
                    >
                      <Heading size="title.sm">@{contributor.login}</Heading>
                    </TrackedLink>
                    <Text size="label.md" color="gray.500">
                      {contributor.contributions}{" "}
                      {contributor.contributions === 1
                        ? "contribution"
                        : "contributions"}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </SimpleGrid>
          </HomepageSection>

          <HomepageSection pb={32}>
            <Heading size="display.sm" mb={12}>
              Open Bounties
            </Heading>

            <Accordion allowToggle defaultIndex={[]}>
              {bounties.map((bounty) => (
                <AccordionItem
                  key={bounty.id}
                  background={"rgba(0,0,0,0.2)"}
                  boxShadow="0 0 0 1px hsl(0deg 0% 100% / 15%)"
                  borderRadius="12px"
                  p={{ base: 6, md: 8 }}
                  my={4}
                >
                  <AccordionButton justifyContent="space-between" py={2}>
                    <Flex direction="column" alignItems="flex-start" gap={4}>
                      <Heading size="label.lg" color="green.400">
                        {bounty.amount}
                      </Heading>
                      <Heading size="label.lg">{bounty.title}</Heading>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel as={Flex} flexDir="column" gap={6}>
                    <Text
                      size="label.md"
                      color="gray.500"
                      mt={2}
                      lineHeight={1.7}
                    >
                      {bounty.description}
                    </Text>
                    <Flex gap={4} flexDir={{ base: "column", md: "row" }}>
                      <LinkButton
                        href={bounty.primaryButtonLink}
                        isExternal
                        color="bgWhite"
                        bgColor="bgBlack"
                        _hover={{ opacity: 0.8 }}
                      >
                        {bounty.primaryButtonText}
                      </LinkButton>
                      <LinkButton
                        href={bounty.secondaryButtonLink}
                        isExternal
                        variant="outline"
                      >
                        {bounty.secondaryButtonText}
                      </LinkButton>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </HomepageSection>

          <HomepageSection pb={32}>
            <Heading size="display.sm" mb={12}>
              Repositories
            </Heading>
            <SimpleGrid columns={{ lg: 3, base: 1 }} gap={{ lg: 12, base: 12 }}>
              {repositories.map((repo) => (
                <RepoCard
                  key={repo.id}
                  title={repo.name}
                  description={repo.description}
                  url={repo.url ?? `https://github.com/thirdweb-dev/${repo.id}`}
                />
              ))}
            </SimpleGrid>
          </HomepageSection>
        </ProductPage>
      </Flex>
    </DarkMode>
  );
};

OSS.pageId = PageId.OSS;

export default OSS;

export const getStaticProps: GetStaticProps = async () => {
  if (!process.env.GITHUB_API_TOKEN) {
    throw new Error("Missing GITHUB_API_TOKEN");
  }

  const authHeader = {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  };

  // Fetch the list of all repositories belonging to the organization
  const reposData = (
    (
      await Promise.all(
        orgNames.map((orgName) =>
          fetch(
            `https://api.github.com/orgs/${orgName}/repos?per_page=100&type=public`,
            authHeader,
          ).then((r) => r.json()),
        ),
      )
    ).flat(1) as GithubRepository[]
  )
    .filter((repo) => repo.fork === false)
    .filter((repo) => repo.name !== "shopify-thirdweb-theme");

  // fetch the contributors for each repository and aggregate them

  const contributorData: GithubContributor[] = (
    await Promise.all(
      reposData.map((repo) =>
        fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contributors`,
          authHeader,
        ).then((r) => r.json()),
      ),
    )
  ).flat(1);

  const contributors: Record<string, GithubContributor> = {};

  contributorData.forEach((contributor) => {
    const login = contributor.login;
    const contributions = contributor.contributions;
    if (contributors[login]) {
      contributors[login].contributions += contributions;
    } else {
      contributors[login] = {
        login,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions,
      };
    }
  });

  // Sort the contributors by their contributions in descending order
  const sortedContributors = Object.values(contributors).sort(
    (a, b) => b.contributions - a.contributions,
  );

  const filteredContributors = sortedContributors
    .filter((contributor) => contributor.contributions > 0)
    .filter((contributor) => contributor.login.indexOf("[bot]") === -1)
    .filter((contributor) => !filterOut.includes(contributor.login));

  return {
    props: { contributors: filteredContributors },
    revalidate: 3600,
  };
};
