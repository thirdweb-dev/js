import { APIHeader } from "@/components/blocks/APIHeader";
import {
  TokenCard,
  TokenImageBasic,
  TokenImageOverride,
  TokenNameBasic,
  TokenSymbolBasic,
} from "@/components/headless-ui/token-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Token Components",
  description:
    "Elevate your ERC20 and native crypto token applications with our React headless UI components, designed for efficient digital currency transactions. These customizable, zero-styling components simplify token interactions, giving developers the flexibility to create their ideal user interface for DeFi platforms, wallets, and other crypto applications.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Token Components"
          description={
            <>
              Elevate your ERC20 and native crypto token applications with our
              React headless UI components, designed for efficient digital
              currency transactions. These customizable, zero-styling components
              simplify token interactions, giving developers the flexibility to
              create their ideal user interface for DeFi platforms, wallets, and
              other crypto applications.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/components/onchain#tokens"
          heroLink="/headless-ui-header.png"
        />
        <section className="space-y-8">
          <TokenImageBasic />
        </section>
        <section className="space-y-8">
          <TokenImageOverride />
        </section>
        <section className="space-y-8">
          <TokenNameBasic />
        </section>
        <section className="space-y-8">
          <TokenSymbolBasic />
        </section>
        <section className="space-y-8">
          <TokenCard />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
