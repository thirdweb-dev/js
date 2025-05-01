import { loginRedirect } from "../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../_utils/authToken";
import { ChatPageContent } from "../components/ChatPageContent";

export default async function Page() {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect();
  }

  return (
    <ChatPageContent
      accountAddress={accountAddress}
      authToken={authToken}
      session={undefined}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
