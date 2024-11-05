import { notFound } from "next/navigation";
import { PayAnalytics } from "../../../../../../components/pay/PayAnalytics/PayAnalytics";
import { getAPIKey } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const apiKey = await getAPIKey((await props.params).id);

  if (!apiKey) {
    notFound();
  }

  return <PayAnalytics clientId={apiKey.key} />;
}
