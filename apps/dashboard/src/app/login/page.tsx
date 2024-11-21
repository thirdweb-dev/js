import { redirect } from "next/navigation";
import { getRawAccount } from "../account/settings/getAccount";
import { LoginAndOnboardingPage } from "./LoginPage";
import { isValidEncodedRedirectPath } from "./isValidEncodedRedirectPath";
import { isOnboardingComplete } from "./onboarding/isOnboardingRequired";

export default async function Page(props: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const nextPath = (await props.searchParams).next;
  const account = await getRawAccount();

  const redirectPath =
    nextPath && isValidEncodedRedirectPath(nextPath) ? nextPath : "/team";

  if (account && isOnboardingComplete(account)) {
    redirect(redirectPath);
  }

  return (
    <LoginAndOnboardingPage account={account} redirectPath={redirectPath} />
  );
}
