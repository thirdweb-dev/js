import { loginRedirect } from "../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../_utils/authToken";
import { ChatPageContent } from "../components/ChatPageContent";
import { nebulaAppThirdwebClient } from "../utils/nebulaThirdwebClient";

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
      client={nebulaAppThirdwebClient}
      session={undefined}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
