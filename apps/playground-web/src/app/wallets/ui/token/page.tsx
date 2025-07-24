import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  TokenImageBasic,
  TokenNameBasic,
  TokenSymbolBasic,
} from "@/components/headless-ui/token-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description:
    "Headless UI components for rendering token image, name, and symbol",
  metadataBase,
  title: "Token Components",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        containerClassName="space-y-12"
        description={
          <>
            Headless UI components for rendering token image, name, and symbol
          </>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#tokens?utm_source=playground"
        title="Token Components"
      >
        <TokenImageBasic />
        <TokenNameBasic />
        <TokenSymbolBasic />
      </PageLayout>
    </ThirdwebProvider>
  );
}
