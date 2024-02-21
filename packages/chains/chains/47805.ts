import type { Chain } from "../src/types";
export default {
  "chain": "REI",
  "chainId": 47805,
  "explorers": [
    {
      "name": "rei-scan",
      "url": "https://scan.rei.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://rei.network/",
  "name": "REI Network",
  "nativeCurrency": {
    "name": "REI",
    "symbol": "REI",
    "decimals": 18
  },
  "networkId": 47805,
  "rpc": [
    "https://47805.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rei.network",
    "wss://rpc.rei.network"
  ],
  "shortName": "REI",
  "slug": "rei-network",
  "testnet": false
} as const satisfies Chain;