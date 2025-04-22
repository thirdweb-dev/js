import { loginRedirect } from "../../login/loginRedirect";
import { getNebulaAuthToken } from "../_utils/authToken";
import { ChatPageContent } from "./components/ChatPageContent";
import { getChains } from "./utils/getChainIds";

export default async function Page(props: {
  searchParams: Promise<{
    q?: string | string[];
    chain?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;

  const [chains, authToken] = await Promise.all([
    getChains(searchParams.chain),
    getNebulaAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect();
  }

  return (
    <ChatPageContent
      authToken={authToken}
      session={undefined}
      type="landing"
      initialParams={{
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
        chainIds: chains.map((c) => c.chainId),
      }}
    />
  );
}
