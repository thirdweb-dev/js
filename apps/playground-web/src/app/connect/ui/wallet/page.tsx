import { APIHeader } from "@/components/blocks/APIHeader";
import {
  WalletIconBasic,
  WalletNameBasic,
  WalletNameFormat,
} from "@/components/headless-ui/wallet-examples";

import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Wallet Components",
  description:
    "Boost your crypto wallet applications with our React headless UI components, optimized for digital asset management. These flexible, unstyled elements simplify cryptocurrency operations while granting developers complete control over the user interface design.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Wallet Components"
          description={
            <>
              Boost your crypto wallet applications with our React headless UI
              components, optimized for digital asset management. These
              flexible, unstyled elements simplify cryptocurrency operations
              while granting developers complete control over the user interface
              design.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/connecting-wallets/ui-components"
          heroLink="/headless-ui-header.png"
        />
        <section className="space-y-8">
          <WalletIconBasic />
        </section>
        <section className="space-y-8">
          <WalletNameBasic />
        </section>
        <section className="space-y-8">
          <WalletNameFormat />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
