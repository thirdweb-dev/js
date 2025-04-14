import { PageLayout } from "@/components/blocks/APIHeader";
import {
  NftCardExample,
  NftDescriptionBasic,
  NftMediaExample,
  NftNameExample,
} from "@/components/headless-ui/nft-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "NFT Components",
  description:
    "Elevate your NFT marketplace with our React headless UI components, engineered for seamless digital asset transactions. These customizable, zero-styling components simplify NFT interactions while giving developers complete freedom to craft their perfect user interface.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="NFT Components"
        description={
          <>Headless UI components for rendering NFT Media and metadata</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#nfts?utm_source=playground"
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
