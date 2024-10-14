import { BillingAlerts } from "../../../../components/settings/Account/Billing/alerts/Alert";
import { ContractsSidebarLayout } from "../../../../core-ui/sidebar/contracts";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <ContractsSidebarLayout>
      <BillingAlerts className="pb-6" />
      {props.children}
    </ContractsSidebarLayout>
  );
}
