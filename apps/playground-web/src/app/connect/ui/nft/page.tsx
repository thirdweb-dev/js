import { APIHeader } from "@/components/blocks/APIHeader";
import {
  NftCardDemo,
  NftDescriptionBasic,
  NftMediaBasic,
  NftMediaOverride,
  NftNameBasic,
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
      <main className="container px-0 pb-20">
        <APIHeader
          title="NFT Components"
          description={
            <>
              Elevate your NFT applications with our React headless UI
              components, engineered for seamless digital asset transactions.
              These customizable, zero-styling components simplify NFT
              interactions while giving developers complete freedom to craft
              their perfect user interface.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/components/onchain#nfts"
          heroLink="/headless-ui-header.png"
        />
        <section className="space-y-8">
          <NftMediaBasic />
        </section>
        <section className="space-y-8">
          <NftMediaOverride />
        </section>
        <section className="space-y-8">
          <NftNameBasic />
        </section>
        <section className="space-y-8">
          <NftDescriptionBasic />
        </section>
        <section className="space-y-8">
          <NftCardDemo />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
