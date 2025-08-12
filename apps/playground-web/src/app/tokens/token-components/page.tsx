import { DollarSignIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  TokenImageBasic,
  TokenNameBasic,
  TokenSymbolBasic,
} from "@/components/headless-ui/token-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Token Components";
const description =
  "Headless UI components for rendering token image, name, and symbol";

export const metadata = createMetadata({
  title,
  description,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        containerClassName="space-y-12"
        icon={DollarSignIcon}
        description={description}
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#tokens?utm_source=playground"
        title={title}
      >
        <TokenImageBasic />
        <TokenNameBasic />
        <TokenSymbolBasic />
      </PageLayout>
    </ThirdwebProvider>
  );
}
