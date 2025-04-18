import { getNebulaAuthToken } from "../_utils/authToken";
import { NebulaLoggedOutStatePage } from "./NebulaLoginPage";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    chain?: string | string[];
    q?: string | string[];
    wallet?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const authToken = await getNebulaAuthToken();

  return (
    <NebulaLoggedOutStatePage
      hasAuthToken={!!authToken}
      params={{
        chain: searchParams.chain,
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
        wallet:
          typeof searchParams.wallet === "string"
            ? searchParams.wallet
            : undefined,
      }}
    />
  );
}
