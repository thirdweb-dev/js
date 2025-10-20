import { redirect } from "next/navigation";
import { StripeRedirectErrorPage } from "../../_components/StripeRedirectErrorPage";
import { getPlanCancelUrl } from "../../utils/billing";

export const dynamic = "force-dynamic";

export default async function CancelPlanPage(props: {
  params: Promise<{
    team_id: string;
  }>;
}) {
  const params = await props.params;

  const billingUrl = await getPlanCancelUrl({
    teamId: params.team_id,
  });

  if (!billingUrl) {
    return <StripeRedirectErrorPage errorMessage="Failed to load page" />;
  }

  redirect(billingUrl);

  return null;
}
