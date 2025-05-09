import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import type { GetAuthTokenResponse } from "../../app/(app)/api/auth/get-auth-token/route";
import { LAST_USED_TEAM_ID } from "../../constants/cookies";
import { getCookie } from "../../lib/cookie";
import { getClientThirdwebClient } from "./thirdweb-client.client";

// returns a thirdweb client with optional JWT passed i

export function useThirdwebClient(jwt?: string) {
  const account = useActiveAccount();
  const lastUsedTeamId = getCookie(LAST_USED_TEAM_ID);

  const query = useQuery({
    queryKey: ["jwt", account?.address],
    // only enable the query if there is an account and no JWT is passed in directly
    enabled: !!account && !jwt,
    retry: false,
    queryFn: async () => {
      if (!account) {
        throw new Error("No account");
      }
      const res = await fetch(
        `/api/auth/get-auth-token?address=${account.address}`,
      );
      if (!res.ok) {
        throw new Error("Failed to get auth token");
      }
      const json = (await res.json()) as GetAuthTokenResponse;
      if (!json.jwt) {
        throw new Error("No JWT in response");
      }
      return json.jwt;
    },
  });

  return useMemo(
    // prefer jwt from props over the one from the token query if it exists
    () =>
      getClientThirdwebClient({
        jwt: jwt || query.data,
        teamId: lastUsedTeamId,
      }),
    [jwt, query.data, lastUsedTeamId],
  );
}

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
