import type { Chain } from "../src/types";
export default {
  "chain": "AOX",
  "chainId": 200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/arbitrum",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://xdaichain.com",
  "name": "Arbitrum on xDai",
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "XDAI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum-on-xdai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum.xdaichain.com/"
  ],
  "shortName": "aox",
  "slug": "arbitrum-on-xdai",
  "testnet": false
} as const satisfies Chain;