import { redirect } from "next/navigation";
import { getRawAccount } from "../account/settings/getAccount";
import { LoginAndOnboardingPage } from "./LoginPage";
import { isOnboardingComplete } from "./onboarding/isOnboardingRequired";

export default async function Page(props: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const nextPath = (await props.searchParams).next;
  const account = await getRawAccount();

  if (account && isOnboardingComplete(account)) {
    if (nextPath) {
      redirect(nextPath);
    } else {
      redirect("/team");
    }
  }

  return <LoginAndOnboardingPage account={account} nextPath={nextPath} />;
}
