export const mockWalletData = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  balance: "1.5 ETH",
  transactions: [
    {
      id: 1,
      type: "Send",
      amount: "0.5 ETH",
      to: "0x123...",
      date: "2023-06-01",
    },
    {
      id: 2,
      type: "Receive",
      amount: "1.0 ETH",
      from: "0x456...",
      date: "2023-05-28",
    },
    {
      id: 3,
      type: "Interact",
      contract: "0x789...",
      method: "approve",
      date: "2023-05-25",
    },
  ],
  contracts: [
    { address: "0xabc...", name: "Uniswap V2", lastInteraction: "2023-06-01" },
    { address: "0xdef...", name: "Aave", lastInteraction: "2023-05-20" },
  ],
  tokens: [
    { symbol: "USDC", balance: "1000", estimatedValue: "$1000", isSpam: false },
    { symbol: "LINK", balance: "50", estimatedValue: "$300", isSpam: false },
    { symbol: "SCAM", balance: "1000000", estimatedValue: "$0", isSpam: true },
  ],
  nfts: [
    {
      id: 1,
      name: "CryptoPunk #1234",
      estimatedValue: "10 ETH",
      image: "https://example.com/cryptopunk1234.png",
    },
    {
      id: 2,
      name: "Bored Ape #5678",
      estimatedValue: "80 ETH",
      image: "https://example.com/boredape5678.png",
    },
    {
      id: 3,
      name: "Doodle #9012",
      estimatedValue: "5 ETH",
      image: "https://example.com/doodle9012.png",
    },
    {
      id: 4,
      name: "Azuki #3456",
      estimatedValue: "15 ETH",
      image: "https://example.com/azuki3456.png",
    },
  ],
};
