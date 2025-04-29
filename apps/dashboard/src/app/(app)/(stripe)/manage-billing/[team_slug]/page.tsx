import { redirect } from "next/navigation";
import { StripeRedirectErrorPage } from "../../_components/StripeRedirectErrorPage";
import { getBillingPortalUrl } from "../../utils/billing";

export default async function ManageBillingPage(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const billingUrl = await getBillingPortalUrl({
    teamSlug: params.team_slug,
  });

  if (!billingUrl) {
    return (
      <StripeRedirectErrorPage errorMessage="Failed to load billing portal" />
    );
  }

  redirect(billingUrl);

  return null;
}
