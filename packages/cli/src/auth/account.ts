// given an auth token return the user account
type MinimalAccount = {
  email?: string;
  creatorWalletAddress: string;
  plan: string;
};

export async function getAccount({
  token,
  secretKey,
}: {
  token?: string;
  secretKey?: string;
}) {
  const headers: Record<string, string> | null = token
    ? { Authorization: `Bearer ${token}` }
    : secretKey
    ? {
        "x-secret-key": secretKey,
      }
    : null;

  if (!headers) {
    throw new Error("No token or secretKey provided");
  }
  const res = await fetch("https://api.thirdweb.com/v1/account/me", {
    headers,
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json.data as MinimalAccount;
}
