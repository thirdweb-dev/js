import { getChains } from "../(app)/utils/getChainIds";
import { getNebulaAuthToken } from "../_utils/authToken";
import { NebulaLoggedOutStatePage } from "./NebulaLoginPage";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    chain?: string | string[];
    q?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const authToken = await getNebulaAuthToken();
  const chains = await getChains(searchParams.chain);

  return (
    <NebulaLoggedOutStatePage
      hasAuthToken={!!authToken}
      params={{
        chains: chains.map((c) => ({
          slug: c.slug,
          id: c.chainId,
        })),
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
      }}
    />
  );
}
