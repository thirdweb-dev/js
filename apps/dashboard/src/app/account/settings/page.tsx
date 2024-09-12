import { redirect } from "next/navigation";
import { AccountSettingsPageUI } from "./AccountSettingsPageUI";
import { getAccount } from "./getAccount";

export default async function Page() {
  const account = await getAccount();

  if (!account) {
    redirect(`/login?next=${encodeURIComponent("/account")}`);
  }

  return <AccountSettingsPageUI account={account} />;
}
