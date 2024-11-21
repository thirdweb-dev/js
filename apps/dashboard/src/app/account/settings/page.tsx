import { getThirdwebClient } from "@/constants/thirdweb.server";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { getValidAccount } from "./getAccount";

export default async function Page() {
  const pagePath = "/account";
  const account = await getValidAccount(pagePath);
  const token = await getAuthToken();

  if (!token) {
    loginRedirect(pagePath);
  }

  return (
    <AccountSettingsPage account={account} client={getThirdwebClient(token)} />
  );
}
