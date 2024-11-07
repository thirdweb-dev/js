import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";
import { EcosystemLayoutSlug } from "./components/EcosystemSlugLayout";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug } = await props.params;
  return (
    <EcosystemLayoutSlug
      params={await props.params}
      ecosystemLayoutPath={`/team/${team_slug}/~/ecosystem`}
    >
      <BillingAlerts className="mb-10" />
      {props.children}
    </EcosystemLayoutSlug>
  );
}
