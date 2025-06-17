import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "@/utils/authToken";
import { loginRedirect } from "@/utils/loginRedirect";
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
      client={nebulaAppThirdwebClient}
      session={undefined}
      type="new-chat"
      initialParams={undefined}
    />
  );
}
