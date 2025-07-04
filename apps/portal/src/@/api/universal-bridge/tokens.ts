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
  // This is a simplified implementation for the portal app
  // In a real implementation, this would fetch from an API
  const mockTokens: TokenMetadata[] = [
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      chainId: props.chainId || 1,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      chainId: props.chainId || 1,
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      chainId: props.chainId || 1,
    },
  ];

  // Filter by chainId if provided
  if (props.chainId) {
    return mockTokens.map((token) => ({ ...token, chainId: props.chainId }));
  }

  return mockTokens;
}
