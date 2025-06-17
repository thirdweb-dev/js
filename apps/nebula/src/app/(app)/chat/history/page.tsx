import { getNebulaAuthToken } from "@/utils/authToken";
import { loginRedirect } from "@/utils/loginRedirect";
import { getSessions } from "../../api/session";
import { ChatHistoryPage } from "./ChatHistoryPage";

export default async function Page() {
  const authToken = await getNebulaAuthToken();

  if (!authToken) {
    loginRedirect();
  }

  const sessions = await getSessions({ authToken }).catch(() => []);
  return <ChatHistoryPage sessions={sessions} authToken={authToken} />;
}
