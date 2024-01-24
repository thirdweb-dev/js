import { AccountPlan, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useRouter } from "next/router";
import { TrackedLinkButton } from "tw-components";

export const UpgradeButton = () => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const router = useRouter();

  if (
    !isLoggedIn ||
    meQuery.isLoading ||
    !meQuery.data ||
    router.pathname.startsWith("/dashboard/settings/billing")
  ) {
    return null;
  }

  const { plan } = meQuery.data;

  return plan === AccountPlan.Free ? (
    <TrackedLinkButton
      category="header"
      label="upgrade"
      href="/dashboard/settings/billing"
      variant="outline"
      colorScheme="blue"
      size="sm"
    >
      Upgrade
    </TrackedLinkButton>
  ) : null;
};
