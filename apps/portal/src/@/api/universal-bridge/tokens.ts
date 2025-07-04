"use server";

export type TokenMetadata = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
  iconUri?: string;
};

export async function getUniversalBridgeTokens(props: { chainId?: number }) {
  const url = new URL("https://bridge.thirdweb.com/v1/tokens");

  if (props.chainId) {
    url.searchParams.append("chainId", String(props.chainId));
  }
  url.searchParams.append("limit", "1000");

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = await res.json();
  return json.data as Array<TokenMetadata>;
}
