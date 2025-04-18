import { redirect } from "next/navigation";
import { loginRedirect } from "../../../../login/loginRedirect";
import { getNebulaAuthToken } from "../../../_utils/authToken";
import { getSessionById } from "../../api/session";
import { ChatPageContent } from "../../components/ChatPageContent";

export default async function Page(props: {
  params: Promise<{
    session_id: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/chat/${params.session_id}`;
  const authToken = await getNebulaAuthToken();

  if (!authToken) {
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
      authToken={authToken}
      session={session}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
