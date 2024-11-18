import { getStripeBillingPortalLink } from "@/api/team-billing";
import { RedirectType, notFound, redirect } from "next/navigation";

interface PageParams {
  team_slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function TeamBillingPortalLink(props: PageProps) {
  const params = await props.params;
  // get the stripe checkout link for the team + sku from the API
  // this returns a status code and a link (if success)
  // 200: success
  // 400: invalid params
  // 401: user not authenticated
  // 403: user not allowed to subscribe (not admin)
  // 500: something random else went wrong
  const { link, status } = await getStripeBillingPortalLink(params.team_slug);

  console.log("status", status);

  if (link) {
    // we want to REPLACE so when the user navigates BACK the do not end up back here but on the previous page
    redirect(link, RedirectType.replace);
  }

  switch (status) {
    case 400: {
      return <div>Invalid Params</div>;
    }
    case 401: {
      return <div>User not authenticated</div>;
    }
    case 403: {
      return <div>User not allowed to subscribe</div>;
    }

    // default case
    default: {
      // todo handle this better
      notFound();
    }
  }
}
