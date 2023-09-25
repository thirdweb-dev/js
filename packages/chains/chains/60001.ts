import type { Chain } from "../src/types";
export default {
  "chainId": 60001,
  "chain": "Thinkium",
  "name": "Thinkium Testnet Chain 1",
  "rpc": [
    "https://thinkium-testnet-chain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test1.thinkiumrpc.net/"
  ],
  "slug": "thinkium-testnet-chain-1",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;