import { redirect } from "next/navigation";
import { getApiKeys } from "../../../../api/lib/getAPIKeys";

export default async function Page() {
  const apiKeys = await getApiKeys();
  const firstKey = apiKeys[0];

  if (firstKey) {
    redirect(`/dashboard/connect/pay/${firstKey.id}`);
  }

  redirect("/dashboard/connect/pay/no-keys");
}
