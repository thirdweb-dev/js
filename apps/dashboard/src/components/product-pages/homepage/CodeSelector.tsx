import { CodeClient } from "@/components/ui/code/code.client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTrack } from "hooks/analytics/useTrack";
import { FileTextIcon, SquareTerminalIcon } from "lucide-react";
import { useState } from "react";
import { LinkButton, type LinkButtonProps } from "tw-components";
import { CodeOptionButton, type CodeOptions } from "../common/CodeOptionButton";

const landingSnippets = {
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
  const { data: nfts, isPending } = useReadContract(getNFTs, { contract });

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
  const { data: nfts, isPending } = useReadContract(getNFTs, { contract });

  // Render NFTs
  return (nfts.data || []).map((nft) => (
    <Image key={nft.id.toString()} source={{uri: resolveScheme({ url: nft.metadata.image, client }}} />
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

const queryClient = new QueryClient();

export const CodeSelector: React.FC<CodeSelectorProps> = ({
  defaultLanguage = "javascript",
  docs = "https://portal.thirdweb.com/",
}) => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>(defaultLanguage);
  const trackEvent = useTrack();

  return (
    <>
      <div className="z-[100] translate-y-[20px] px-6 md:translate-y-[50%]">
        <div className="flex flex-wrap justify-center gap-1 rounded-lg border bg-background p-1 ">
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
        </div>
      </div>

      <div className="relative w-full max-w-[800px]">
        <QueryClientProvider client={queryClient}>
          <CodeClient
            scrollableClassName="pt-6 pb-12 md:pb-6 mt-4"
            code={landingSnippets[activeLanguage]}
            lang={
              activeLanguage === "react" || activeLanguage === "react-native"
                ? "jsx"
                : activeLanguage === "unity"
                  ? "cpp"
                  : activeLanguage
            }
          />
        </QueryClientProvider>

        {/* Links for Replit and Docs  */}
        <div className="absolute right-6 bottom-2 flex items-center justify-end gap-4">
          <CustomLinkButton
            px={4}
            text="Docs"
            href={docs}
            icon={<FileTextIcon className="size-4 text-white" />}
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
            icon={<SquareTerminalIcon className="size-4 text-white" />}
            onClick={() =>
              trackEvent({
                category: "code-selector",
                action: "click",
                label: "documentation",
              })
            }
          />
        </div>
      </div>
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
      borderRadius="10px"
      fontFamily="mono"
      color="white"
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
