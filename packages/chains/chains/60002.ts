import type { Chain } from "../src/types";
export default {
  "chainId": 60002,
  "chain": "Thinkium",
  "name": "Thinkium Testnet Chain 2",
  "rpc": [
    "https://thinkium-testnet-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test2.thinkiumrpc.net/"
  ],
  "slug": "thinkium-testnet-chain-2",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;