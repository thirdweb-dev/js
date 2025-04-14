import { PageLayout } from "@/components/blocks/APIHeader";
import {
  ChainIconExample,
  ChainNameExample,
} from "@/components/headless-ui/chain-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Chain Components",
  description: "Headless UI components for rendering chain name and icon",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Chain Components"
        description={
          <>Headless UI components for rendering chain name and icon</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#chains?utm_source=playground"
        containerClassName="space-y-12"
      >
        <ChainIconExample />
        <ChainNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
