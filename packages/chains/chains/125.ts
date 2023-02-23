export default {
  "name": "OYchain Testnet",
  "chain": "OYchain",
  "rpc": [
    "https://oychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oychain.io"
  ],
  "faucets": [
    "https://faucet.oychain.io"
  ],
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "infoURL": "https://www.oychain.io",
  "shortName": "OYchainTestnet",
  "chainId": 125,
  "networkId": 125,
  "slip44": 125,
  "explorers": [
    {
      "name": "OYchain Testnet Explorer",
      "url": "https://explorer.testnet.oychain.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "oychain-testnet"
} as const;