import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import type { WalletUser } from "thirdweb/wallets";
import { THIRDWEB_EWS_API_HOST } from "@/constants/urls";
import { embeddedWalletsKeys } from "../query-keys/cache-keys";

const fetchAccountList = ({
  jwt,
  clientId,
  pageNumber,
}: {
  jwt: string;
  clientId: string;
  pageNumber: number;
}) => {
  return async () => {
    const url = new URL(`${THIRDWEB_EWS_API_HOST}/api/2024-05-05/account/list`);
    url.searchParams.append("clientId", clientId);
    url.searchParams.append("page", pageNumber.toString());

    const res = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch wallets: ${await res.text()}`);
    }

    const json = await res.json();
    return json as {
      users: WalletUser[];
    };
  };
};

export function useEmbeddedWallets(params: {
  clientId: string;
  page: number;
  authToken: string;
}) {
  const { clientId, page, authToken } = params;
  const address = useActiveAccount()?.address;

  return useQuery({
    enabled: !!address && !!clientId,
    queryFn: fetchAccountList({
      clientId,
      jwt: authToken,
      pageNumber: page,
    }),
    queryKey: embeddedWalletsKeys.embeddedWallets(
      address || "",
      clientId,
      page,
    ),
  });
}

// TODO: fetching list of all users needs to be improved
export function useAllEmbeddedWallets(params: { authToken: string }) {
  const { authToken } = params;
  const queryClient = useQueryClient();
  const address = useActiveAccount()?.address;

  return useMutation({
    mutationFn: async ({ clientId }: { clientId: string }) => {
      const responses: WalletUser[] = [];
      let page = 1;

      while (true) {
        const res = await queryClient.fetchQuery<{
          users: WalletUser[];
        }>({
          queryFn: fetchAccountList({
            clientId,
            jwt: authToken,
            pageNumber: page,
          }),
          queryKey: embeddedWalletsKeys.embeddedWallets(
            address || "",
            clientId,
            page,
          ),
        });

        if (res.users.length === 0) {
          break;
        }

        page++;
        responses.push(...res.users);
      }

      return responses;
    },
  });
}
