import { getRawAccount } from "../account/settings/getAccount";
import { LoginAndOnboardingPage } from "./LoginPage";

export default async function Page(props: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const nextPath = (await props.searchParams).next;
  const account = await getRawAccount();

  // don't redirect away from login page if authToken is already present and onboarding is done
  // so that if user is stuck in a state where cookie is set, account onboarding is complete but the wallet is not connected, they can connect wallet, sign in and continue

  // if the user is already logged in, wallet is connected and onboarding is complete
  // user will be redirected to the next path on the client side without having to do anything

  return <LoginAndOnboardingPage account={account} nextPath={nextPath} />;
}
