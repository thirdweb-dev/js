import { BuildYourApp } from "./components/BuildYourApp";
import { LatestEvents } from "./components/LatestEvents";
import { ShareContract } from "./components/ShareContract";
import {
  Divider,
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { contractType, useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { useContractFunctions } from "components/contract-components/hooks";
import { ImportContract } from "components/contract-components/import-contract";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { Heading, Link } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

const GUIDES = {
  "edition-drop": [
    {
      title: "Create An NFT Gated Website",
      url: "https://blog.thirdweb.com/guides/nft-gated-website/",
    },
    {
      title: "Create an Early Access NFT with TypeScript and React",
      url: "https://blog.thirdweb.com/guides/early-access-nft-with-typescript/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/edition-drop/" },
  ],
  edition: [
    {
      title: "Sell Your NFT in Multiple Currencies at the Same Time",
      url: "https://blog.thirdweb.com/guides/sell-nft-multiple-currencies/",
    },
    {
      title: "Create A Discord Bot That Gives NFT Holders A Role",
      url: "https://blog.thirdweb.com/guides/create-a-discord-bot-that-gives-nft-holders-a-role/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/edition/" },
  ],
  marketplace: [
    {
      title: "Create Your Own NFT Marketplace with TypeScript and Next.js",
      url: "https://blog.thirdweb.com/guides/nft-marketplace-with-typescript-next/",
    },
    {
      title: "Build An Auction Button For Your NFT Marketplace",
      url: "https://blog.thirdweb.com/guides/auction-button-react/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/marketplace/" },
  ],
  multiwrap: [],
  "nft-collection": [
    {
      title: "Mint an NFT with no code",
      url: "https://blog.thirdweb.com/guides/create-nft-with-no-code/",
    },
    {
      title: "Let Users Pick Which NFT They Want to Mint",
      url: "https://blog.thirdweb.com/guides/mint-specific-nft/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/nft-collection/" },
  ],
  "nft-drop": [
    {
      title: "How to use batch upload with an NFT Drop",
      url: "https://blog.thirdweb.com/guides/how-to-batch-upload/",
    },
    {
      title: "How to accept credit card payments for your NFT drop",
      url: "https://blog.thirdweb.com/guides/accept-credit-card-payments/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/nft-drop/" },
  ],
  pack: [
    {
      title: "Create NFT Loot-Boxes Using the Pack Contract",
      url: "https://blog.thirdweb.com/guides/create-an-nft-loot-box/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/pack/" },
  ],
  "signature-drop": [
    {
      title: "Create Simultaneous Allowlists with Signature Drop and Next.js",
      url: "https://blog.thirdweb.com/guides/simultaneous-allowlists/",
    },
    {
      title: "Create an ERC721A NFT Drop with Signature-Based Minting",
      url: "https://blog.thirdweb.com/guides/signature-drop/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/signature-drop/" },
  ],
  split: [
    {
      title: "Deploy an NFT Drop with Revenue Share",
      url: "https://blog.thirdweb.com/guides/nft-drop-with-revenue-share/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/split/" },
  ],
  "token-drop": [
    {
      title: "Build An ERC20 Token Claim App in React",
      url: "https://blog.thirdweb.com/guides/claim-erc20-token-nextjs/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/token-drop/" },
  ],
  token: [
    {
      title: "Create an ERC20 token with TypeScript",
      url: "https://blog.thirdweb.com/guides/create-your-currency-with-typescript-sdk/",
    },
    {
      title: "Create an ERC20 token with Python",
      url: "https://blog.thirdweb.com/guides/create-your-currency-with-python-sdk/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/token/" },
  ],
  vote: [
    {
      title: "Build a DAO With a Treasury and a Governance Token",
      url: "https://blog.thirdweb.com/guides/build-treasury-and-governance-for-your-dao/",
    },
    // { title: "View all", url: "https://blog.thirdweb.com/tag/vote/" },
  ],
  custom: [],
};

const TEMPLATES = {
  "edition-drop": [
    {
      title: "Edition Drop Minting",
      url: "https://github.com/thirdweb-example/edition-drop",
    },
  ],
  edition: [
    {
      title: "Karting Game - Unity",
      url: "https://github.com/thirdweb-example/unity-karting-game",
    },
  ],
  marketplace: [
    {
      title: "Marketplace",
      url: "https://github.com/thirdweb-example/marketplace",
    },
  ],
  multiwrap: [
    {
      title: "Multiwrap",
      url: "https://github.com/thirdweb-example/multiwrap",
    },
  ],
  "nft-collection": [],
  "nft-drop": [],
  pack: [
    {
      title: "Packs",
      url: "https://github.com/thirdweb-example/packs",
    },
  ],
  "signature-drop": [
    {
      title: "Signature Drop",
      url: "https://github.com/thirdweb-example/signature-drop",
    },
  ],
  split: [],
  "token-drop": [],
  token: [],
  vote: [
    {
      title: "DAO",
      url: "https://github.com/thirdweb-example/dao",
    },
  ],
  custom: [],
};

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const { contract, isSuccess, isError } = useContract(contractAddress);
  const contractTypeQuery = contractType.useQuery(contractAddress);
  const contractTypeData = contractTypeQuery?.data;

  const functions = useContractFunctions(contract?.abi as Abi);
  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  if ((!contract?.abi && isSuccess) || isError) {
    return <ImportContract contractAddress={contractAddress} />;
  }

  return (
    <SimpleGrid columns={{ base: 1, xl: 4 }} gap={8}>
      <GridItem as={Flex} colSpan={{ xl: 3 }} direction="column" gap={16}>
        <LatestEvents contractAddress={contractAddress} />
        <BuildYourApp />
        <ShareContract address={contractAddress} />
      </GridItem>
      <GridItem as={Flex} direction="column" gap={6}>
        {contractTypeData && GUIDES[contractTypeData].length > 0 && (
          <Flex direction="column" gap={6}>
            <Heading size="title.sm">Relevant guides</Heading>
            <Flex gap={4} direction="column">
              {GUIDES[contractTypeData].map((guide) => (
                <Link
                  isExternal
                  fontWeight={500}
                  href={guide.url}
                  key={guide.title}
                  fontSize="14px"
                  color="heading"
                  opacity={0.6}
                  display="inline-block"
                  _hover={{
                    opacity: 1,
                    textDecoration: "none",
                  }}
                >
                  {guide.title}
                </Link>
              ))}
            </Flex>
          </Flex>
        )}
        {contractTypeData &&
          GUIDES[contractTypeData].length > 0 &&
          TEMPLATES[contractTypeData].length > 0 && <Divider />}
        {contractTypeData && TEMPLATES[contractTypeData].length > 0 && (
          <Flex direction="column" gap={4}>
            <Heading size="title.sm">Relevant templates</Heading>
            <Flex gap={4} direction="column">
              {TEMPLATES[contractTypeData].map((guide) => (
                <Link
                  isExternal
                  fontWeight={500}
                  href={guide.url}
                  key={guide.title}
                  fontSize="14px"
                  color="heading"
                  opacity={0.6}
                  display="inline-block"
                  _hover={{ opacity: 1, textDecoration: "none" }}
                >
                  {guide.title}
                </Link>
              ))}
            </Flex>
          </Flex>
        )}
      </GridItem>
    </SimpleGrid>
  );
};
