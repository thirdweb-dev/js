import type { Chain } from "../types";
export default {
  "chain": "Thinkium",
  "chainId": 60000,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Testnet Chain 0",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 60000,
  "rpc": [
    "https://thinkium-testnet-chain-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://60000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.thinkiumrpc.net/"
  ],
  "shortName": "TKM-test0",
  "slug": "thinkium-testnet-chain-0",
  "testnet": true
} as const satisfies Chain;