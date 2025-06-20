import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  ChainIconExample,
  ChainNameExample,
} from "@/components/headless-ui/chain-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description: "Headless UI components for rendering chain name and icon",
  metadataBase,
  title: "Chain Components",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        containerClassName="space-y-12"
        description={
          <>Headless UI components for rendering chain name and icon</>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#chains?utm_source=playground"
        title="Chain Components"
      >
        <ChainIconExample />
        <ChainNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
