import { ImageIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  NftCardExample,
  NftDescriptionBasic,
  NftMediaExample,
  NftNameExample,
} from "@/components/headless-ui/nft-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "NFT Components";
const description =
  "Headless UI components for rendering NFT Media and metadata";

export const metadata = createMetadata({
  title,
  description,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={ImageIcon}
        description={description}
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#nfts?utm_source=playground"
        title={title}
      >
        <div className="space-y-14">
          <NftMediaExample />
          <NftNameExample />
          <NftDescriptionBasic />
          <NftCardExample />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
