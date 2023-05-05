import { HomePageCodeBlock } from "../CodeBlock";
import { KeyFeatureLayout } from "./key-features/KeyFeatureLayout";
import { AspectRatio, GridItem, SimpleGrid } from "@chakra-ui/react";
import darkTheme from "prism-react-renderer/themes/vsDark";

const withThirdwebCode = `// Fetch all nfts from a erc721 contract on polygon.

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("polygon");
const contract = await sdk.getContract("0x..");
const nfts = await contract.erc721.getAll();`;

const withoutThirdwebCode = `// Fetch all nfts from a erc721 contract on polygon.

import { ethers, BigNumberish, BigNumber } from "ethers";

const provider = ethers.providers.getDefaultProvider(
  "https://polygon-rpc.com/"
);
const contractAddress = "0x...";

// copy pasted from etherscan or contract project
const contractAbi = [ ... ];

const contract = new ethers.Contract(contractAddress, contractAbi, provider);

async function ownerOf(tokenId: BigNumberish): Promise<string> {
  return await contract.ownerOf(tokenId);
}

async function fetchTokenMetadata(tokenId: BigNumberish, tokenUri: string) {
  const parsedUri = tokenUri.replace(
    "{id}",
    ethers.utils.hexZeroPad(BigNumber.from(tokenId).toHexString(), 32).slice(2)
  );
  let jsonMetadata;
  try {
    const res = await fetch(
      \`https://ipfs.io/ipfs/\${parsedUri.replace("ipfs://", "")}\`
    );
    jsonMetadata = await res.json();
  } catch (err) {
    const unparsedTokenIdUri = tokenUri.replace(
      "{id}",
      BigNumber.from(tokenId).toString()
    );
    try {
      const res = await fetch(
        \`https://ipfs.io/ipfs/\${unparsedTokenIdUri.replace("ipfs://", "")}\`
      );
      jsonMetadata = await res.json();
    } catch (e: any) {
      console.warn(
        \`failed to get token metadata: \${JSON.stringify({
          tokenId: tokenId.toString(),
          tokenUri,
        })} -- falling back to default metadata\`
      );
      jsonMetadata = {};
    }
  }

  return {
    ...jsonMetadata,
    id: BigNumber.from(tokenId).toString(),
    uri: tokenUri,
  };
}

async function getTokenMetadata(tokenId: BigNumberish) {
  const tokenUri = await contract.tokenURI(tokenId);
  if (!tokenUri) {
    throw new Error("no token URI");
  }
  return fetchTokenMetadata(tokenId, tokenUri);
}

async function get(tokenId: BigNumberish) {
  const [owner, metadata] = await Promise.all([
    ownerOf(tokenId).catch(() => ethers.constants.AddressZero),
    getTokenMetadata(tokenId).catch(() => ({
      id: tokenId.toString(),
      uri: "",
    })),
  ]);
  return { owner, metadata, type: "ERC721", supply: 1 };
}

async function getAll(paginationStart?: number, pageCount?: number) {
  const start = BigNumber.from(paginationStart || 0).toNumber();
  const count = BigNumber.from(pageCount || 1000).toNumber();

  const maxSupply = await contract.totalSupply();
  const maxId = Math.min(maxSupply.toNumber(), start + count);
  return await Promise.all(
    [...Array(maxId - start).keys()].map((i) => get((start + i).toString()))
  );
}

const nfts = await getAll();`;

export const WithoutThirdwebSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Simple"
      titleGradient="linear-gradient(246.04deg, #3385FF 9.81%, #91B7F0 76.17%, #95BBF2 93.64%)"
      headline="Web3 made easy."
      description=""
    >
      <SimpleGrid columns={12} gap={8} w="full">
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <AspectRatio ratio={16 / 10} w="full">
            <HomePageCodeBlock
              darkTheme={darkTheme}
              color="white"
              fontSize={{ base: "12px", md: "14px" }}
              borderWidth={0}
              code={withoutThirdwebCode}
              language="typescript"
              overflow="auto"
              autoType
              typingSpeed={5}
              title="Without thirdweb (88 lines)"
              titleColor="gray.600"
              borderTopRadius={0}
            />
          </AspectRatio>
        </GridItem>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <AspectRatio ratio={16 / 10} w="full">
            <HomePageCodeBlock
              darkTheme={darkTheme}
              color="white"
              fontSize={{ base: "12px", md: "14px" }}
              borderWidth={0}
              code={withThirdwebCode}
              language="typescript"
              overflow="auto"
              autoType
              typingSpeed={5}
              title="With thirdweb (7 lines)"
              titleColor="white"
              borderTopRadius={0}
            />
          </AspectRatio>
        </GridItem>
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
