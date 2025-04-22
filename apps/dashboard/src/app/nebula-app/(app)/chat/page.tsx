import { loginRedirect } from "../../../(app)/login/loginRedirect";
import { getNebulaAuthToken } from "../../_utils/authToken";
import { ChatPageContent } from "../components/ChatPageContent";

export default async function Page() {
  const authToken = await getNebulaAuthToken();

  if (!authToken) {
    loginRedirect();
  }

  return (
    <ChatPageContent
      authToken={authToken}
      session={undefined}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
