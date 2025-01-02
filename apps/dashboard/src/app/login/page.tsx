import { getRawAccount } from "../account/settings/getAccount";
import { LoginAndOnboardingPage } from "./LoginPage";
import { isValidEncodedRedirectPath } from "./isValidEncodedRedirectPath";

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

  const redirectPath =
    nextPath && isValidEncodedRedirectPath(nextPath) ? nextPath : "/team";

  return (
    <LoginAndOnboardingPage account={account} redirectPath={redirectPath} />
  );
}
