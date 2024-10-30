import { InAppWalletUsersPageContent } from "components/embedded-wallets/Users";
import { TRACKING_CATEGORY } from "../_constants";

export default function Page({
  params,
}: { params: { team_slug: string; project_slug: string } }) {
  return (
    <>
      <InAppWalletUsersPageContent
        clientId={params.project_slug}
        trackingCategory={TRACKING_CATEGORY}
      />
    </>
  );
}
