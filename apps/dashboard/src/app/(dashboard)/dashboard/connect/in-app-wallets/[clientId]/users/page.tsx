import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { redirect } from "next/navigation";
import { getInAppWalletSupportedAPIKeys } from "../../getInAppWalletSupportedAPIKeys";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: {
    clientId: string;
  };
}) {
  const { clientId } = props.params;
  const apiKeys = await getInAppWalletSupportedAPIKeys();
  const apiKey = apiKeys.find((key) => key.key === clientId);

  if (!apiKey) {
    redirect("/dashboard/connect/in-app-wallets");
  }
  return (
    <InAppWalletUsersPageContent
      clientId={apiKey.key}
      trackingCategory={TRACKING_CATEGORY}
    />
  );
}
