import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  WalletIconExample,
  WalletNameExample,
} from "@/components/headless-ui/wallet-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description: "Headless UI components for rendering wallet name and icon",
  metadataBase,
  title: "Wallet Components",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        containerClassName="space-y-12"
        description={
          <>Headless UI components for rendering wallet name and icon</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/connecting-wallets/ui-components?utm_source=playground"
        title="Wallet Components"
      >
        <WalletIconExample />
        <WalletNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
