import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { getSessionById } from "../../api/session";
import { ChatPageContent } from "../../components/ChatPageContent";

export default async function Page(props: {
  params: Promise<{
    session_id: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/chat/${params.session_id}`;
  const authToken = await getAuthToken();
  const account = await getValidAccount();

  if (!authToken) {
    loginRedirect(pagePath);
  }

  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    loginRedirect(pagePath);
  }

  const session = await getSessionById({
    authToken,
    sessionId: params.session_id,
  }).catch(() => undefined);

  if (!session) {
    redirect("/");
  }

  return (
    <ChatPageContent
      accountAddress={accountAddress}
      authToken={authToken}
      session={session}
      type="new-chat"
      account={account}
      initialPrompt={undefined}
    />
  );
}
