import { getRawAccount } from "../../account/settings/getAccount";
import { LoginAndOnboardingPage } from "../../login/LoginPage";
import { isValidEncodedRedirectPath } from "../../login/isValidEncodedRedirectPath";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const nextPath = (await props.searchParams).next;
  const account = await getRawAccount();

  const redirectPath =
    nextPath && isValidEncodedRedirectPath(nextPath) ? nextPath : "/";

  return (
    <LoginAndOnboardingPage account={account} redirectPath={redirectPath} />
  );
}
