import type { Chain } from "../src/types";
export default {
  "name": "BEVM",
  "chain": "ChainX",
  "rpc": [
    "https://bevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.bevm.io/",
    "https://rpc-2.bevm.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://chainx.org",
  "shortName": "chainx",
  "chainId": 1501,
  "networkId": 1501,
  "explorers": [
    {
      "name": "bevm scan",
      "url": "https://scan.bevm.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bevm"
} as const satisfies Chain;