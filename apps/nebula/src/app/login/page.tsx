import { getNebulaAuthToken } from "@/utils/authToken";
import { getChainsForNebula } from "@/utils/nebula-chains";
import { NebulaLoggedOutStatePage } from "./NebulaLoginPage";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    chain?: string | string[];
    q?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const authToken = await getNebulaAuthToken();
  const chains = await getChainsForNebula(searchParams.chain);

  return (
    <NebulaLoggedOutStatePage
      hasAuthToken={!!authToken}
      params={{
        chains: chains.map((c) => ({
          id: c.chainId,
          slug: c.slug,
        })),
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
      }}
    />
  );
}
