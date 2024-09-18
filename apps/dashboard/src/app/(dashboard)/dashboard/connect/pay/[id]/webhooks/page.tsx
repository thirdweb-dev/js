import { notFound } from "next/navigation";
import { getAPIKey } from "../../../../../../api/lib/getAPIKeys";
import { WebhooksPage } from "../../components/webhooks.client";

export default async function Page(props: {
  params: {
    id: string;
  };
}) {
  const apiKey = await getAPIKey(props.params.id);

  if (!apiKey) {
    notFound();
  }

  return <WebhooksPage clientId={apiKey.key} />;
}
