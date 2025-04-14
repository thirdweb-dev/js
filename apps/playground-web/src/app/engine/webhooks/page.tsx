import { EngineWebhooksPreview } from "@/app/engine/webhooks/_components/webhooks-preview";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Webhooks"
        description={
          <>
            Configure webhooks in Engine to notify your backend server of
            transaction or backend wallet events.
          </>
        }
        docsLink="https://portal.thirdweb.com/engine/features/webhooks?utm_source=playground"
      >
        <EngineWebhooksPreview />
      </PageLayout>
    </ThirdwebProvider>
  );
}
