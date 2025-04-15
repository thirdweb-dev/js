import { getRawAccount } from "../../account/settings/getAccount";
import { NebulaLoginPage } from "./NebulaLoginPage";

export default async function NebulaLogin(props: {
  searchParams: Promise<{
    chain?: string | string[];
    q?: string | string[];
    wallet?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const account = await getRawAccount();

  return (
    <NebulaLoginPage
      account={account}
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
