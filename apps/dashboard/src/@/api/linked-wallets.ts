import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { API_SERVER_URL } from "../constants/env";

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

  const res = await fetch(`${API_SERVER_URL}/v1/account/wallets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    const json = (await res.json()) as {
      data: LinkedWallet[];
    };

    return json.data;
  }

  return null;
}
