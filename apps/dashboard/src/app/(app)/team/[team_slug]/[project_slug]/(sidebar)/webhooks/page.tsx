// This is a temporary page to supress linting errors and will be implemented up in the stack
import { getWebhooks } from "@/api/insight/webhooks";

export default async function WebhooksPage() {
  const { data: webhooks, error } = await getWebhooks("123");

  return <div>{JSON.stringify({ webhooks, error })}</div>;
}
