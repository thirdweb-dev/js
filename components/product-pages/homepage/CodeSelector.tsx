import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Language } from "prism-react-renderer";
import { Dispatch, SetStateAction, useState } from "react";
import { flushSync } from "react-dom";
import {
  SiGo,
  SiJavascript,
  SiPython,
  SiReact,
  SiReplit,
} from "react-icons/si";
import {
  Button,
  ButtonProps,
  CodeBlock,
  LinkButton,
  PossibleButtonSize,
} from "tw-components";

const LOGO_OPTIONS = {
  typescript: {
    icon: SiJavascript,
    fill: "yellow",
  },
  react: {
    icon: SiReact,
    fill: "#61dafb",
  },
  python: {
    icon: SiPython,
    fill: "#3e7aac",
  },
  go: {
    icon: SiGo,
    fill: "#50b7e0",
  },
} as const;

const codeSnippets = {
  typescript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("rinkeby");
const nftCollection = sdk.getNFTCollection("0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e");

const nfts = await nftCollection.getAll();`,
  react: `import {
  ThirdwebNftMedia,
  useNFTCollection,
  useNFTs,
} from "@thirdweb-dev/react";

export default function App() {
  const nftCollection = useNFTCollection(
    "0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e",
  );
  const { data: nfts } = useNFTs(nftCollection);

  return (nfts || []).map((nft) => (
    <div key={nft.metadata.id.toString()}>
      <ThirdwebNftMedia metadata={nft.metadata} />
      <h3>{nft.metadata.name}</h3>
    </div>
  ));
}`,
  python: `from thirdweb import ThirdwebSDK
from pprint import pprint

sdk = ThirdwebSDK("rinkeby")

nftCollection = sdk.get_nft_collection(
    "0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e")

nfts = nftCollection.get_all()
pprint(nfts)
  `,
  go: `package main

import (
  "encoding/json"
  "fmt"
  "github.com/thirdweb-dev/go-sdk/thirdweb"
)

func main() {
  sdk, _ := thirdweb.NewThirdwebSDK("rinkeby", nil)

  // Add your NFT Collection contract address here
  address := "0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e"
  nft, _ := sdk.GetNFTCollection(address)

  // Now you can use any of the read-only SDK contract functions
  nfts, _ := nft.GetAll()

  b, _ := json.MarshalIndent(nfts, "", "  ")
  fmt.Printf(string(b))
}`,
};

export type CodeOptions = keyof typeof LOGO_OPTIONS;

interface CodeOptionButtonProps extends ButtonProps {
  language: CodeOptions;
  activeLanguage: CodeOptions;
  setActiveLanguage: Dispatch<SetStateAction<CodeOptions>>;
}
const CodeOptionButton: React.FC<CodeOptionButtonProps> = ({
  children,
  language,
  setActiveLanguage,
  activeLanguage,
  ...rest
}) => {
  const { trackEvent } = useTrack();

  const logo = LOGO_OPTIONS[language];
  const size = useBreakpointValue(
    { base: "sm", md: "md" },
    "md",
  ) as PossibleButtonSize;

  return (
    <Button
      leftIcon={<Icon as={logo.icon} fill={logo.fill} />}
      borderRadius="md"
      variant="solid"
      colorScheme="blackAlpha"
      bg="#1E1E24"
      borderWidth="1px"
      size={size}
      borderColor={
        language === activeLanguage ? "#0098EE" : "rgba(255, 255, 255, 0.1)"
      }
      _hover={{ borderColor: "#0098EE" }}
      _active={{
        borderColor: language === activeLanguage ? "#0098EE" : undefined,
      }}
      onClick={() => {
        trackEvent({
          category: "code-selector",
          action: "switch-language",
          label: language,
        });
        flushSync(() => {
          setActiveLanguage(language);
        });
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export const CodeSelector: React.FC = () => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>("typescript");
  const { trackEvent } = useTrack();
  return (
    <>
      <SimpleGrid
        gap={{ base: 2, md: 3 }}
        columns={{ base: 2, md: 4 }}
        justifyContent={{ base: "space-between", md: "center" }}
      >
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="typescript"
        >
          JavaScript
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="python"
        >
          Python
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="react"
        >
          React
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="go"
        >
          Go
        </CodeOptionButton>
      </SimpleGrid>

      <CodeBlock
        w={{ base: "full", md: "80%" }}
        borderColor="#4953AF"
        borderWidth="2px"
        py={4}
        code={codeSnippets[activeLanguage]}
        language={
          activeLanguage === "react" ? "jsx" : (activeLanguage as Language)
        }
      />

      <Flex
        gap={{ base: 4, md: 6 }}
        align="center"
        direction={{ base: "column", md: "row" }}
        w="100%"
        maxW="container.sm"
      >
        <LinkButton
          role="group"
          borderRadius="md"
          p={6}
          variant="gradient"
          fromcolor="#1D64EF"
          tocolor="#E0507A"
          isExternal
          colorScheme="primary"
          w="full"
          href={`https://replit.com/@thirdweb-dev/${activeLanguage}-sdk`}
          rightIcon={
            <Icon
              color="#E0507A"
              _groupHover={{ color: "#1D64EF" }}
              as={SiReplit}
            />
          }
        >
          <Box as="span">Try it on Replit</Box>
        </LinkButton>
        <LinkButton
          variant="outline"
          borderRadius="md"
          bg="#fff"
          color="#000"
          w="full"
          maxW="container.sm"
          _hover={{
            bg: "whiteAlpha.800",
          }}
          href="https://portal.thirdweb.com/"
          isExternal
          p={6}
          onClick={() =>
            trackEvent({
              category: "code-selector",
              action: "click",
              label: "documentation",
            })
          }
        >
          Explore documentation
        </LinkButton>
      </Flex>
    </>
  );
};
