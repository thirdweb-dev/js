import type { Chain } from "../types";
export default {
  "chain": "Thinkium",
  "chainId": 60002,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Testnet Chain 2",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 60002,
  "rpc": [
    "https://thinkium-testnet-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://60002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.thinkiumrpc.net/"
  ],
  "shortName": "TKM-test2",
  "slug": "thinkium-testnet-chain-2",
  "testnet": true
} as const satisfies Chain;