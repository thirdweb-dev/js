import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export type LinkedWallet = {
  createdAt: string;
  id: string;
  walletAddress: string;
};

export async function getLinkedWallets() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/wallets`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    const json = (await res.json()) as {
      data: LinkedWallet[];
    };

    return json.data;
  }

  return null;
}
