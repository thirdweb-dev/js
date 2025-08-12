import { PlaneIcon } from "lucide-react";
import { EngineAirdropPreview } from "@/app/transactions/airdrop-tokens/_components/airdrop-preview";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { AirdropCode } from "./_components/airdrop-code";

const title = "Airdrop Tokens";
const description =
  "Airdrop ERC-20, ERC-721, or ERC-1155 tokens at scale to multiple addresses. Support gas sponsorship and receive real-time status updates for each transaction.";
const ogDescription =
  "Airdrop any collection of ERC20, ERC721, or ERC1155 tokens with a few lines of code. Try the flow, inspect the smart contract, and copy code directly into your app.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "transactions",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={PlaneIcon}
        description={description}
        docsLink="https://thirdweb-engine.apidocumentation.com/reference#tag/erc20/POST/contract/{chain}/{contractAddress}/erc20/mint-batch-to?utm_source=playground"
        title={title}
      >
        <EngineAirdropPreview />
        <div className="h-10" />
        <AirdropCode />
      </PageLayout>
    </ThirdwebProvider>
  );
}
