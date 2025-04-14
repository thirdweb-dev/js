import { PageLayout } from "@/components/blocks/APIHeader";
import {
  TokenImageBasic,
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
    "Headless UI components for rendering token image, name, and symbol",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Token Components"
        description={
          <>
            Headless UI components for rendering token image, name, and symbol
          </>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#tokens?utm_source=playground"
        containerClassName="space-y-12"
      >
        <TokenImageBasic />
        <TokenNameBasic />
        <TokenSymbolBasic />
      </PageLayout>
    </ThirdwebProvider>
  );
}
