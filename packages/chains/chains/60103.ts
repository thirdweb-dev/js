export default {
  "name": "Thinkium Testnet Chain 103",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-testnet-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test103.thinkiumrpc.net/"
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM-test103",
  "chainId": 60103,
  "networkId": 60103,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "thinkium-testnet-chain-103"
} as const;