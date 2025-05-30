import { redirect } from "next/navigation";
import { loginRedirect } from "../../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../../_utils/authToken";
import { getSessionById } from "../../api/session";
import { ChatPageContent } from "../../components/ChatPageContent";
import { nebulaAppThirdwebClient } from "../../utils/nebulaThirdwebClient";

export default async function Page(props: {
  params: Promise<{
    session_id: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/chat/${params.session_id}`;
  const authToken = await getNebulaAuthToken();
  const accountAddress = await getNebulaAuthTokenWalletAddress();

  if (!authToken || !accountAddress) {
    loginRedirect(pagePath);
  }

  const session = await getSessionById({
    authToken: authToken,
    sessionId: params.session_id,
  }).catch(() => undefined);

  if (!session) {
    redirect("/");
  }

  return (
    <ChatPageContent
      accountAddress={accountAddress}
      authToken={authToken}
      client={nebulaAppThirdwebClient}
      session={session}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
