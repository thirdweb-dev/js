import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
import { LinkWalletUI } from "./LinkWalletUI";

export default async function Page() {
  return (
    <div className="grow">
      <BillingAlerts className="mb-10" />
      <LinkWalletUI
        // TODO -  fetch the wallets of current user
        wallets={[]}
      />
    </div>
  );
}
