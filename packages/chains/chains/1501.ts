import type { Chain } from "../src/types";
export default {
  "chainId": 1501,
  "chain": "ChainX",
  "name": "BEVM",
  "rpc": [
    "https://bevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.bevm.io/",
    "https://rpc-2.bevm.io/"
  ],
  "slug": "bevm",
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://chainx.org",
  "shortName": "chainx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "bevm scan",
      "url": "https://scan.bevm.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;