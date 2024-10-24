import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { TRACKING_CATEGORY } from "../_constants";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  return (
    <>
      <InAppWalletUsersPageContent
        clientId={params.project_slug}
        trackingCategory={TRACKING_CATEGORY}
      />
    </>
  );
}
