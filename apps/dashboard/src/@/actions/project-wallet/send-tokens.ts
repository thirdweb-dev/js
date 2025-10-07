"use server";

import { apiServerProxy } from "@/actions/proxies";

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

  const response = await apiServerProxy<{
    result?: { transactionIds: string[] };
    error?: { message?: string };
  }>({
    body: JSON.stringify({
      chainId,
      from: walletAddress,
      recipients: [
        {
          address: recipientAddress,
          quantity: quantityWei,
        },
      ],
      ...(tokenAddress ? { tokenAddress } : {}),
    }),
    headers: {
      "Content-Type": "application/json",
      "x-client-id": publishableKey,
      "x-team-id": teamId,
      ...(secretKey ? { "x-secret-key": secretKey } : {}),
      ...(vaultAccessToken ? { "x-vault-access-token": vaultAccessToken } : {}),
    },
    method: "POST",
    pathname: "/v1/wallets/send",
  });

  if (!response.ok) {
    return {
      error: response.error || "Failed to submit transfer request.",
      ok: false,
    } as const;
  }

  return {
    ok: true,
    transactionIds: response.data?.result?.transactionIds ?? [],
  } as const;
}
