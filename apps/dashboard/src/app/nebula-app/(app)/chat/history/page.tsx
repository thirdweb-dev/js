import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { getSessions } from "../../api/session";
import { ChatHistoryPage } from "./ChatHistoryPage";

export default async function Page() {
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect();
  }

  const sessions = await getSessions({ authToken }).catch(() => []);
  return <ChatHistoryPage sessions={sessions} authToken={authToken} />;
}
