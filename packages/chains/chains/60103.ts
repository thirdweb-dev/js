import type { Chain } from "../src/types";
export default {
  "chainId": 60103,
  "chain": "Thinkium",
  "name": "Thinkium Testnet Chain 103",
  "rpc": [
    "https://thinkium-testnet-chain-103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test103.thinkiumrpc.net/"
  ],
  "slug": "thinkium-testnet-chain-103",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;