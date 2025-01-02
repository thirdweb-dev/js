import { getValidAccount } from "../settings/getAccount";
import { AccountDevicesPage } from "./AccountDevicesPage";

export default async function Page() {
  // enforce valid account
  await getValidAccount("/account/devices");

  return <AccountDevicesPage />;
}
