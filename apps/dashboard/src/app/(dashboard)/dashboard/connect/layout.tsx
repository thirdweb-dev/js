import { BillingAlerts } from "../../../../components/settings/Account/Billing/alerts/Alert";
import { ConnectSidebarLayout } from "./DashboardConnectLayout";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <ConnectSidebarLayout>
      <BillingAlerts className="pb-6" />
      {props.children}
    </ConnectSidebarLayout>
  );
}
