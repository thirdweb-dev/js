import type { Chain } from "../src/types";
export default {
  "chainId": 200,
  "chain": "AOX",
  "name": "Arbitrum on xDai",
  "rpc": [
    "https://arbitrum-on-xdai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum.xdaichain.com/"
  ],
  "slug": "arbitrum-on-xdai",
  "faucets": [],
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://xdaichain.com",
  "shortName": "aox",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/arbitrum",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;