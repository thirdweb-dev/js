import { unstable_cache } from "next/cache";
import { isAddress } from "thirdweb";
import { fetchChain } from "../../../utils/fetchChain";
import { loginRedirect } from "../../login/loginRedirect";
import { getNebulaAuthToken } from "../_utils/authToken";
import { ChatPageContent } from "./components/ChatPageContent";

export default async function Page(props: {
  searchParams: Promise<{
    q?: string | string[];
    chain?: string | string[];
    wallet?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;

  const [chainIds, authToken] = await Promise.all([
    getChainIds(searchParams.chain),
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
        chainIds: chainIds,
        wallet:
          typeof searchParams.wallet === "string" &&
          isAddress(searchParams.wallet)
            ? searchParams.wallet
            : undefined,
      }}
    />
  );
}

const getChainIds = unstable_cache(
  async (_chainNames: string[] | string | undefined) => {
    if (!_chainNames) {
      return [];
    }

    const chainIds: number[] = [];

    const chainNames =
      typeof _chainNames === "string" ? [_chainNames] : _chainNames;

    const chainResults = await Promise.allSettled(
      chainNames.map((x) => fetchChain(x)),
    );

    for (const chainResult of chainResults) {
      if (chainResult.status === "fulfilled" && chainResult.value) {
        chainIds.push(chainResult.value.chainId);
      }
    }

    return chainIds;
  },
  ["nebula_getChainIds"],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  },
);
