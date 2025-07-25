import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getRawAccount } from "../(app)/account/settings/getAccount";
import { isValidEncodedRedirectPath } from "./isValidEncodedRedirectPath";
import { LoginAndOnboardingPage } from "./LoginPage";

export default async function Page(props: {
  searchParams: Promise<{
    next: string | string[] | undefined;
    "in-app-wallet": string | string[] | undefined;
  }>;
}) {
  const searchParams = await props.searchParams;
  const nextPath =
    typeof searchParams.next === "string" ? searchParams.next : undefined;
  const account = await getRawAccount();

  // don't redirect away from login page if authToken is already present and onboarding is done
  // so that if user is stuck in a state where cookie is set, account onboarding is complete but the wallet is not connected, they can connect wallet, sign in and continue

  // if the user is already logged in, wallet is connected and onboarding is complete
  // user will be redirected to the next path on the client side without having to do anything

  const redirectPath =
    nextPath && isValidEncodedRedirectPath(nextPath) ? nextPath : "/team";

  return (
    <LoginAndOnboardingPage
      account={account}
      client={getClientThirdwebClient()}
      loginWithInAppWallet={searchParams["in-app-wallet"] === "true"}
      redirectPath={redirectPath}
    />
  );
}
