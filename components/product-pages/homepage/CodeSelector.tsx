import { CodeOptionButton, CodeOptions } from "../common/CodeOptionButton";
import { Flex, Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { themes } from "prism-react-renderer";
import { useState } from "react";
import { AiOutlineCode } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import { Card, CodeBlock, LinkButton, LinkButtonProps } from "tw-components";

const darkTheme = themes.dracula;

export const landingSnippets = {
  javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// initialize the SDK
const sdk = new ThirdwebSDK("mumbai");

// connect to your smart contract
const contract = await sdk.getContract("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c");

// get all NFTs
const nfts = await contract.erc721.getAll();

console.info(nfts);`,
  react: `import { ThirdwebNftMedia, useContract, useNFTs } from "@thirdweb-dev/react";

export default function App() {
  // Connect to your smart contract
  const { contract } = useContract("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c");

  // Get all NFTs
  const nfts = useNFTs(contract);

  // Render NFTs
  return (nfts.data || []).map((nft) => (
    <ThirdwebNftMedia key={nft.metadata.id.toString()} metadata={nft.metadata} />
  ));
}`,
  "react-native": `import { useContract, useNFTs } from "@thirdweb-dev/react-native";

export default function App() {
  // Connect to your smart contract
  const { contract } = useContract("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c");

  // Get all NFTs
  const nfts = useNFTs(contract);

  // Render NFTs
  return (nfts.data || []).map((nft) => (
    <Image key={nft.metadata.id.toString()} source={{uri: nft.metadata.image}} />
  ));
}`,
  python: `from thirdweb import ThirdwebSDK
from pprint import pprint

sdk = ThirdwebSDK("mumbai")

nftCollection = sdk.get_nft_drop("0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c")

nfts = nftCollection.get_all()
pprint(nfts)`,
  go: `package main

import (
  "context"
  "encoding/json"
  "fmt"
  "github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

func main() {
  sdk, _ := thirdweb.NewThirdwebSDK("mumbai", nil)

  // Add your NFT Drop contract address here
  address := "0xe68904F3018fF980b6b64D06d7f7fBCeFF4cB06c"
  nft, _ := sdk.GetNFTDrop(address)

  // Now you can use any of the read-only SDK contract functions
  nfts, _ := nft.GetAll(context.Background())

  b, _ := json.MarshalIndent(nfts, "", "  ")
  fmt.Printf(string(b))
}`,
  unity: `using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Thirdweb;

public class Example : MonoBehaviour {
  void Start() {
    ThirdwebSDK sdk = new ThirdwebSDK("goerli");
    string address = "0xb1c42E0C4289E68f1C337Eb0Da6a38C4c9F3f58e";
    NFTCollection nft = sdk.GetContract(address);
    List<NFT> nfts = await contract.ERC721.GetAll()
  }
}`,
};

const authSnippets = {
  javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("goerli");

// Login with a single line of code
const payload = await sdk.auth.login();

// And verify the address of the logged in wallet
const address = await sdk.auth.verify(payload);`,
  react: `import { useSDK } from "@thirdweb-dev/react";

export default function App() {
 const sdk = useSDK();

 async function login() {
  // Login with a single line of code
  const payload = await sdk.auth.login();

  // And verify the address of the logged in wallet
  const address = await sdk.auth.verify(payload);
 }
}`,
  "react-native": "",
  python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("goerli")

# Login with a single line of code
payload = sdk.auth.login();

# And verify the address of the logged in wallet
address = sdk.auth.verify(payload);`,
  go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

func main() {
  sdk, err := thirdweb.NewThirdwebSDK("goerli", nil)

  // Login with a single line of code
  payload, err := sdk.Auth.Login()

  // And verify the address of the logged in wallet
  address, err := sdk.Auth.Verify(payload)
}`,
  unity: ``,
};

export interface CodeSelectorProps {
  defaultLanguage?: CodeOptions;
  snippets?: "landing" | "auth";
  docs?: string;
}

export const CodeSelector: React.FC<CodeSelectorProps> = ({
  defaultLanguage = "javascript",
  snippets = "landing",
  docs = "https://portal.thirdweb.com/",
}) => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>(defaultLanguage);
  const trackEvent = useTrack();

  const actualSnippets =
    snippets === "landing" ? landingSnippets : authSnippets;

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
        {Object.keys(actualSnippets).map((key) =>
          actualSnippets[key as keyof typeof actualSnippets] ? (
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
          code={actualSnippets[activeLanguage]}
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

          {snippets === "landing" && (
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
          )}
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
