import { Flex, Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { themes } from "prism-react-renderer";
import { useState } from "react";
import { AiOutlineCode } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import {
  Card,
  CodeBlock,
  LinkButton,
  type LinkButtonProps,
} from "tw-components";
import { CodeOptionButton, type CodeOptions } from "../common/CodeOptionButton";

const darkTheme = themes.dracula;

export const landingSnippets = {
  javascript: `import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

// initialize the client
const client = createThirdwebClient({ clientId });

// connect to your smart contract
const contract = getContract({ client, chain: sepolia, address: "0x..." });

// get all NFTs
const nfts = await getNFTs({ contract });

console.info(nfts);`,
  react: `import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract, MediaRenderer } from "thirdweb/react";

// initialize the client
const client = createThirdwebClient({ clientId });

// connect to your smart contract
const contract = getContract({ client, chain: sepolia, address: "0x..." });

export default function App() {
  // Get all NFTs
  const { data: nfts, isLoading } = useReadContract(getNFTs, { contract });

  // Render NFTs
  return (nfts.data || []).map((nft) => (
    <MediaRenderer key={nft.id.toString()} src={nft.metadata.image} />
  ));
}`,
  "react-native": `import { createThirdwebClient, getContract, resolveScheme } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

// initialize the client
const client = createThirdwebClient({ clientId });
  
// connect to your smart contract
const contract = getContract({ client, chain: sepolia, address: "0x..." });

export default function App() {
  // Get all NFTs
  const { data: nfts, isLoading } = useReadContract(getNFTs, { contract });

  // Render NFTs
  return (nfts.data || []).map((nft) => (
    <Image key={nft.metadata.id.toString()} source={{uri: resolveScheme({ url: nft.metadata.image, client }}} />
  ));
}`,
  unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Get any contract
Contract contract = sdk.GetContract("0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e");

// Get all NFTs
List<NFT> nfts = await contract.ERC721.GetAll()`,
};

export interface CodeSelectorProps {
  defaultLanguage?: CodeOptions;
  docs?: string;
}

export const CodeSelector: React.FC<CodeSelectorProps> = ({
  defaultLanguage = "javascript",
  docs = "https://portal.thirdweb.com/",
}) => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>(defaultLanguage);
  const trackEvent = useTrack();

  return (
    <>
      <Flex
        background="rgba(0,0,0,0.4)"
        boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
        justify={"center"}
        margin="0 auto"
        transform={{ base: "translateY(20px)", md: "translateY(50%)" }}
        zIndex={100}
        backdropFilter={"blur(10px)"}
        borderRadius={"8px"}
        padding="2px"
        gap={"2px"}
        maxW="calc(100% - 60px)"
        flexWrap="wrap"
      >
        {Object.keys(landingSnippets).map((key) =>
          landingSnippets[key as keyof typeof landingSnippets] ? (
            <CodeOptionButton
              key={key}
              setActiveLanguage={setActiveLanguage}
              activeLanguage={activeLanguage}
              language={key as CodeOptions}
              textTransform="capitalize"
            >
              {key === "javascript"
                ? "JavaScript"
                : key === "react-native"
                  ? "React Native"
                  : key}
            </CodeOptionButton>
          ) : null,
        )}
      </Flex>

      <Card
        w={{ base: "full", md: "69%" }}
        p={0}
        background="rgba(0,0,0,0.4)"
        boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
        position="relative"
        border="none"
      >
        <CodeBlock
          darkTheme={darkTheme}
          color="white"
          fontSize={{ base: "12px", md: "14px" }}
          borderWidth={0}
          w="full"
          py={6}
          pb={{ base: 12, md: 6 }}
          code={landingSnippets[activeLanguage]}
          language={
            activeLanguage === "react" || activeLanguage === "react-native"
              ? "jsx"
              : activeLanguage === "unity"
                ? "cpp"
                : activeLanguage
          }
          backgroundColor="transparent"
          mt={4}
        />

        {/* Links for Replit and Docs  */}
        <Flex justify="end" gap={6} position="absolute" bottom={0} right={2}>
          <CustomLinkButton
            px={4}
            text="Docs"
            href={docs}
            icon={<Icon color={"white"} as={CgFileDocument} />}
            onClick={() =>
              trackEvent({
                category: "code-selector",
                action: "click",
                label: "try-it",
              })
            }
          />

          <CustomLinkButton
            text="Run"
            href={`https://replit.com/@thirdweb/${activeLanguage}-sdk`}
            icon={<Icon color={"white"} as={AiOutlineCode} />}
            onClick={() =>
              trackEvent({
                category: "code-selector",
                action: "click",
                label: "documentation",
              })
            }
          />
        </Flex>
      </Card>
    </>
  );
};

interface CustomLinkButtonProps extends LinkButtonProps {
  onClick: () => void;
  text: string;
  href: string;
  icon: React.ReactElement;
}

const CustomLinkButton: React.FC<CustomLinkButtonProps> = ({
  onClick,
  href,
  icon,
  text,
  ...linkButtonProps
}) => {
  return (
    <LinkButton
      href={href}
      isExternal
      leftIcon={icon}
      bg="transparent"
      noIcon
      padding={0}
      fontWeight={400}
      fontSize="14px"
      borderRadius={"10px"}
      fontFamily={"mono"}
      color={"white"}
      _hover={{
        bg: "trnasparent",
      }}
      onClick={onClick}
      {...linkButtonProps}
    >
      {text}
    </LinkButton>
  );
};
