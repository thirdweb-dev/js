import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "@/utils/authToken";
import { loginRedirect } from "../../@/utils/loginRedirect";
import { ChatPageContent } from "./components/ChatPageContent";
import { getChainsForNebula } from "./utils/getChainIds";

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
      initialParams={{
        chainIds: chains.map((c) => c.chainId),
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
      }}
      session={undefined}
      type="landing"
    />
  );
}
