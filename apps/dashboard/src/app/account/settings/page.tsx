import { getThirdwebClient } from "@/constants/thirdweb.server";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { getAccount } from "./getAccount";

export default async function Page() {
  const account = await getAccount();
  const token = getAuthToken();

  if (!account || !token) {
    redirect(`/login?next=${encodeURIComponent("/account")}`);
  }

  return (
    <AccountSettingsPage account={account} client={getThirdwebClient(token)} />
  );
}
