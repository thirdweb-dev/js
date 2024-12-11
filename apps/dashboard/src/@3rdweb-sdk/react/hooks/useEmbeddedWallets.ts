import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { THIRDWEB_EWS_API_HOST } from "constants/urls";
import { useActiveAccount } from "thirdweb/react";
import type { WalletUser } from "thirdweb/wallets";
import { embeddedWalletsKeys } from "../cache-keys";

const fetchAccountList = ({
  jwt,
  clientId,
  pageNumber,
}: { jwt: string; clientId: string; pageNumber: number }) => {
  return async () => {
    const url = new URL(`${THIRDWEB_EWS_API_HOST}/api/2024-05-05/account/list`);
    url.searchParams.append("clientId", clientId);
    url.searchParams.append("page", pageNumber.toString());

    const res = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
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
    queryKey: embeddedWalletsKeys.embeddedWallets(
      address || "",
      clientId,
      page,
    ),
    queryFn: fetchAccountList({
      jwt: authToken,
      clientId,
      pageNumber: page,
    }),
    placeholderData: keepPreviousData,
    enabled: !!address && !!clientId,
  });
}

export function useAllEmbeddedWallets(params: {
  authToken: string;
}) {
  const { authToken } = params;
  const queryClient = useQueryClient();
  const address = useActiveAccount()?.address;

  return useMutation({
    mutationFn: async ({
      clientId,
      totalPages,
    }: { clientId: string; totalPages: number }) => {
      const walletRes = [];
      for (let page = 1; page <= totalPages; page++) {
        const res = queryClient.fetchQuery<{
          users: WalletUser[];
          totalPages: number;
        }>({
          queryKey: embeddedWalletsKeys.embeddedWallets(
            address || "",
            clientId,
            page,
          ),
          queryFn: fetchAccountList({
            jwt: authToken,
            clientId,
            pageNumber: page,
          }),
        });
        walletRes.push(res);
      }
      return (await Promise.all(walletRes)).flatMap((res) => res.users);
    },
  });
}
