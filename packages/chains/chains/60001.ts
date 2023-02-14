export default {
  "name": "Thinkium Testnet Chain 1",
  "chain": "Thinkium",
  "rpc": [
    "https://thinkium-testnet-chain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test1.thinkiumrpc.net/"
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
  "shortName": "TKM-test1",
  "chainId": 60001,
  "networkId": 60001,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "thinkium-testnet-chain-1"
} as const;