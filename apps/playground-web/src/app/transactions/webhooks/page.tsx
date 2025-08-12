import { RssIcon } from "lucide-react";
import { EngineWebhooksPreview } from "@/app/transactions/webhooks/_components/webhooks-preview";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Transaction Webhooks";
const description =
  "Configure webhooks to notify your backend of transaction events or activity from your server wallet";
const ogDescription =
  "Set up webhooks using Transactions to receive real-time notifications for transactions and wallet events. Test the flow and see example payloads in action.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "transactions",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={RssIcon}
        description={description}
        docsLink="https://portal.thirdweb.com/engine/v2/features/webhooks?utm_source=playground"
        title={title}
      >
        <EngineWebhooksPreview />
      </PageLayout>
    </ThirdwebProvider>
  );
}
