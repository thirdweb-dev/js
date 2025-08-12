import { WalletCardsIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  WalletIconExample,
  WalletNameExample,
} from "@/components/headless-ui/wallet-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Wallet Components";
const description = "Headless UI components for rendering wallet name and icon";

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
        icon={WalletCardsIcon}
        containerClassName="space-y-12"
        description={description}
        docsLink="https://portal.thirdweb.com/react/v5/connecting-wallets/ui-components?utm_source=playground"
        title={title}
      >
        <WalletIconExample />
        <WalletNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
