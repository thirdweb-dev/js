import { StampIcon } from "lucide-react";
import { EngineMintPreview } from "@/app/transactions/mint-tokens/_components/mint-preview";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { MintCode } from "./_components/mint-code";

const title = "Mint NFTs";
const description =
  "Enable users to mint new tokens into any smart contract. Gas fees are sponsored, so users only need to provide a wallet address";
const ogDescription =
  "Interactive demo for gasless token minting. Mint tokens to any contract with just a wallet address. Sponsor gas and streamline UX.";

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
        icon={StampIcon}
        description={description}
        docsLink="https://engine.thirdweb.com/reference"
        title={title}
      >
        <EngineMintPreview />
        <div className="h-10" />
        <MintCode />
      </PageLayout>
    </ThirdwebProvider>
  );
}
