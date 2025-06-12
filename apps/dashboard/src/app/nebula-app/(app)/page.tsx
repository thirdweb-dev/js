import { loginRedirect } from "../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../_utils/authToken";
import { ChatPageContent } from "./components/ChatPageContent";
import { getChainsForNebula } from "./utils/getChainIds";
import { nebulaAppThirdwebClient } from "./utils/nebulaThirdwebClient";

export default async function Page(props: {
  searchParams: Promise<{
    q?: string | string[];
    chain?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;

  const [chains, authToken, accountAddress] = await Promise.all([
    getChainsForNebula(searchParams.chain),
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
      type="landing"
      initialParams={{
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
        chainIds: chains.map((c) => c.chainId),
      }}
    />
  );
}
