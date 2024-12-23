import { getValidAccount } from "../../account/settings/getAccount";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { ChatPageContent } from "./components/ChatPageContent";

export default async function Page(props: {
  searchParams: Promise<{
    prompt?: string;
  }>;
}) {
  const [searchParams, authToken] = await Promise.all([
    props.searchParams,
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect();
  }

  const account = await getValidAccount();

  return (
    <ChatPageContent
      authToken={authToken}
      session={undefined}
      type="landing"
      account={account}
      initialPrompt={searchParams.prompt}
    />
  );
}
