import type { Chain } from "../src/types";
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
  "features": [],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Testnet Chain 0",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://thinkium-testnet-chain-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.thinkiumrpc.net/"
  ],
  "shortName": "TKM-test0",
  "slug": "thinkium-testnet-chain-0",
  "testnet": true
} as const satisfies Chain;