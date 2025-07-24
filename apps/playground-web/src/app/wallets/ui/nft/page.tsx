import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  NftCardExample,
  NftDescriptionBasic,
  NftMediaExample,
  NftNameExample,
} from "@/components/headless-ui/nft-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description:
    "Elevate your NFT marketplace with our React headless UI components, engineered for seamless digital asset transactions. These customizable, zero-styling components simplify NFT interactions while giving developers complete freedom to craft their perfect user interface.",
  metadataBase,
  title: "NFT Components",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>Headless UI components for rendering NFT Media and metadata</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#nfts?utm_source=playground"
        title="NFT Components"
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
