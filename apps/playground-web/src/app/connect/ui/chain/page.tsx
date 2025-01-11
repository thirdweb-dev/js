import { APIHeader } from "@/components/blocks/APIHeader";
import {
  ChainIconBasic,
  ChainNameBasic,
} from "@/components/headless-ui/chain-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Chain Components",
  description:
    "Enhance your applications with our Chain components, featuring a collection of chain icons, names, and symbols. These customizable components simplify the integration of blockchain information, allowing developers to easily display and manage multiple chains in their user interfaces.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Chain Components"
          description={
            <>
              Enhance your applications with our Chain components, featuring a
              collection of chain icons, names, and symbols. These customizable
              components simplify the integration of blockchain information,
              allowing developers to easily display and manage multiple chains
              in their user interfaces.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/components/onchain#chains"
          heroLink="/headless-ui-header.png"
        />
        <section className="space-y-8">
          <ChainIconBasic />
        </section>
        <section className="space-y-8">
          <ChainNameBasic />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
