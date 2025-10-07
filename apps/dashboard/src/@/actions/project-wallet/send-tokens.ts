"use server";

import { configure, sendTokens } from "@thirdweb-dev/api";
import { THIRDWEB_API_HOST } from "@/constants/urls";

configure({
  override: {
    baseUrl: THIRDWEB_API_HOST,
  },
});

export async function sendProjectWalletTokens(options: {
  walletAddress: string;
  recipientAddress: string;
  chainId: number;
  quantityWei: string;
  publishableKey: string;
  teamId: string;
  tokenAddress?: string;
  secretKey: string;
  vaultAccessToken?: string;
}) {
  const {
    walletAddress,
    recipientAddress,
    chainId,
    quantityWei,
    publishableKey,
    teamId,
    tokenAddress,
    secretKey,
    vaultAccessToken,
  } = options;

  if (!secretKey) {
    return {
      error: "A project secret key is required to send funds.",
      ok: false,
    } as const;
  }

  const response = await sendTokens({
    body: {
      chainId,
      from: walletAddress,
      recipients: [
        {
          address: recipientAddress,
          quantity: quantityWei,
        },
      ],
      ...(tokenAddress ? { tokenAddress } : {}),
    },
    headers: {
      "Content-Type": "application/json",
      "x-client-id": publishableKey,
      "x-secret-key": secretKey,
      "x-team-id": teamId,
      ...(vaultAccessToken ? { "x-vault-access-token": vaultAccessToken } : {}),
    },
  });

  if (response.error || !response.data) {
    return {
      error: response.error || "Failed to submit transfer request.",
      ok: false,
    } as const;
  }

  return {
    ok: true,
    transactionIds: response.data.result?.transactionIds ?? [],
  } as const;
}
