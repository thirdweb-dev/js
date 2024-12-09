import { redirect } from "next/navigation";
import { getRawAccount } from "../../account/settings/getAccount";
import { LoginAndOnboardingPage } from "../../login/LoginPage";
import { isValidEncodedRedirectPath } from "../../login/isValidEncodedRedirectPath";
import { isOnboardingComplete } from "../../login/onboarding/isOnboardingRequired";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const nextPath = (await props.searchParams).next;
  const account = await getRawAccount();

  const redirectPath =
    nextPath && isValidEncodedRedirectPath(nextPath) ? nextPath : "/";

  // if no login or onboarding required, redirect back
  if (account && isOnboardingComplete(account)) {
    redirect(redirectPath);
  }

  return (
    <LoginAndOnboardingPage account={account} redirectPath={redirectPath} />
  );
}
