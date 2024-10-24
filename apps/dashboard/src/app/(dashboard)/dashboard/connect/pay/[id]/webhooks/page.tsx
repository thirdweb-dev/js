import { notFound } from "next/navigation";
import { getAPIKey } from "../../../../../../api/lib/getAPIKeys";
import { PayWebhooksPage } from "../../components/webhooks.client";

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const apiKey = await getAPIKey((await props.params).id);

  if (!apiKey) {
    notFound();
  }

  return <PayWebhooksPage clientId={apiKey.key} />;
}
