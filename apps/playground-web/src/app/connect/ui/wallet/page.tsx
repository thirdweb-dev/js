import { PageLayout } from "@/components/blocks/APIHeader";
import {
  WalletIconExample,
  WalletNameExample,
} from "@/components/headless-ui/wallet-examples";

import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Wallet Components",
  description: "Headless UI components for rendering wallet name and icon",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Wallet Components"
        description={
          <>Headless UI components for rendering wallet name and icon</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/connecting-wallets/ui-components?utm_source=playground"
        containerClassName="space-y-12"
      >
        <WalletIconExample />
        <WalletNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
