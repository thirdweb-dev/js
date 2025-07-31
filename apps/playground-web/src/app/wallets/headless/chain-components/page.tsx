import { LinkIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  ChainIconExample,
  ChainNameExample,
} from "@/components/headless-ui/chain-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Chain Components";
const description = "Headless UI components for rendering chain name and icon";

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
        icon={LinkIcon}
        containerClassName="space-y-12"
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/react/v5/components/onchain#chains?utm_source=playground"
      >
        <ChainIconExample />
        <ChainNameExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}
