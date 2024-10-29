import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { THIRDWEB_EWS_API_HOST } from "constants/urls";
import type { WalletUser } from "thirdweb/wallets";
import { embeddedWalletsKeys } from "../cache-keys";
import { useLoggedInUser } from "./useLoggedInUser";

export function useEmbeddedWallets(clientId: string, page: number) {
  const { user, isLoggedIn } = useLoggedInUser();

  return useQuery({
    queryKey: embeddedWalletsKeys.embeddedWallets(
      user?.address as string,
      clientId,
      page,
    ),
    queryFn: async () => {
      const url = new URL(
        `${THIRDWEB_EWS_API_HOST}/api/2024-05-05/account/list`,
      );
      url.searchParams.append("clientId", clientId);
      url.searchParams.append("page", page.toString());

      const res = await fetch(url.href, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.jwt}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch wallets: ${await res.text()}`);
      }

      const json = await res.json();
      return json as {
        users: WalletUser[];
        totalPages: number;
      };
    },
    placeholderData: keepPreviousData,
    enabled: !!user?.address && isLoggedIn && !!clientId,
  });
}
