import { InAppWalletSettingsPage } from "components/embedded-wallets/Configure";
import { redirect } from "next/navigation";
import { getInAppWalletSupportedAPIKeys } from "../../getInAppWalletSupportedAPIKeys";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: Promise<{ clientId: string }>;
}) {
  const params = await props.params;
  const { clientId } = params;

  const apiKeys = await getInAppWalletSupportedAPIKeys();
  const apiKey = apiKeys.find((key) => key.key === clientId);

  if (!apiKey) {
    redirect("/dashboard/connect/in-app-wallets");
  }
  return (
    <InAppWalletSettingsPage
      apiKey={apiKey}
      trackingCategory={TRACKING_CATEGORY}
    />
  );
}
