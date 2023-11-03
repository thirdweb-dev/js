import type { Chain } from "../types";
export default {
  "chain": "ChainX",
  "chainId": 1501,
  "explorers": [
    {
      "name": "bevm scan",
      "url": "https://scan.bevm.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://chainx.org",
  "name": "BEVM",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 1501,
  "rpc": [
    "https://bevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1501.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.bevm.io/",
    "https://rpc-2.bevm.io/"
  ],
  "shortName": "chainx",
  "slug": "bevm",
  "testnet": false
} as const satisfies Chain;