export default {
  "name": "Thinkium Testnet Chain 2",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-testnet-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.thinkiumrpc.net/"
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
  "shortName": "TKM-test2",
  "chainId": 60002,
  "networkId": 60002,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "thinkium-testnet-chain-2"
} as const;