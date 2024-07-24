import type { Chain } from "../src/types";
export default {
  "chain": "Xterio",
  "chainId": 2702128,
  "explorers": [
    {
      "name": "Xterio Chain Explorer",
      "url": "https://eth.xterscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://xter.io",
  "name": "Xterio Chain",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2702128,
  "rpc": [
    "https://2702128.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xterio-eth.alt.technology"
  ],
  "shortName": "xterio",
  "slug": "xterio-chain",
  "testnet": false
} as const satisfies Chain;