import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { embeddedWalletsKeys } from "../cache-keys";
import { THIRDWEB_EWS_API_HOST } from "constants/urls";

// FIXME: Make API to return camelCase or transform
export type EmbeddedWalletUser = {
  id: string;
  client_id: string;
  created_at: string;
  last_accessed_at: string;

  embedded_wallet: {
    id: string;
    address: string;
    chain: string;
    wallet_user_id: string;
  }[];
  ews_authed_user: {
    id: string;
    authed_user_id: string;
    email: string;
  }[];
};

export function useEmbeddedWallets(clientId: string) {
  const address = useAddress();

  return useQuery(
    embeddedWalletsKeys.embeddedWallets(address as string, clientId as string),
    async () => {
      const res = await fetch(
        `${THIRDWEB_EWS_API_HOST}/api/thirdweb/embedded-wallet?clientId=${clientId}&lastAccessedAt=0`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const json = await res.json();

      return json.walletUsers as EmbeddedWalletUser[];
    },
    { enabled: !!address && !!clientId },
  );
}
