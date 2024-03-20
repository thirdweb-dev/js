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
  "infoURL": "https://xdaichain.com",
  "name": "Arbitrum on xDai",
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "networkId": 200,
  "parent": {
    "type": "L2",
    "chain": "eip155-100"
  },
  "rpc": [
    "https://200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum.xdaichain.com/"
  ],
  "shortName": "aox",
  "slug": "arbitrum-on-xdai",
  "testnet": false
} as const satisfies Chain;