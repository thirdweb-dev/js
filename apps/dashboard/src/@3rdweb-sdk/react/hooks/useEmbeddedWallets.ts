import { useQuery } from "@tanstack/react-query";
import { THIRDWEB_EWS_API_HOST } from "constants/urls";
import { embeddedWalletsKeys } from "../cache-keys";
import { useLoggedInUser } from "./useLoggedInUser";

// FIXME: Make API to return camelCase or transform
export type EmbeddedWalletUser = {
  id: string;
  client_id: string;
  created_at: string;
  last_accessed_at: string;
  embedded_wallet?: {
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
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery(
    embeddedWalletsKeys.embeddedWallets(
      user?.address as string,
      clientId as string,
    ),
    async () => {
      const res = await fetch(
        `${THIRDWEB_EWS_API_HOST}/api/thirdweb/embedded-wallet?clientId=${clientId}&lastAccessedAt=0`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.jwt}`,
          },
        },
      );

      const json = await res.json();

      return json.walletUsers as EmbeddedWalletUser[];
    },
    { enabled: !!user?.address && isLoggedIn && !!clientId },
  );
}
