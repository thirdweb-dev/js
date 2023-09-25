import type { Chain } from "../src/types";
export default {
  "chainId": 60000,
  "chain": "Thinkium",
  "name": "Thinkium Testnet Chain 0",
  "rpc": [
    "https://thinkium-testnet-chain-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.thinkiumrpc.net/"
  ],
  "slug": "thinkium-testnet-chain-0",
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM-test0",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;