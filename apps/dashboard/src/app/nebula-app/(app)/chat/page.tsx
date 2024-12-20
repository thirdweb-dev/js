import { getValidAccount } from "../../../account/settings/getAccount";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
import { ChatPageContent } from "../components/ChatPageContent";

export default async function Page() {
  const authToken = await getAuthToken();
  const account = await getValidAccount();

  if (!authToken) {
    loginRedirect();
  }

  return (
    <ChatPageContent
      authToken={authToken}
      session={undefined}
      type="new-chat"
      account={account}
      initialPrompt={undefined}
    />
  );
}
