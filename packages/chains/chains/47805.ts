import type { Chain } from "../src/types";
export default {
  "chainId": 47805,
  "chain": "REI",
  "name": "REI Network",
  "rpc": [
    "https://rei-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rei.network",
    "wss://rpc.rei.network"
  ],
  "slug": "rei-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "REI",
    "symbol": "REI",
    "decimals": 18
  },
  "infoURL": "https://rei.network/",
  "shortName": "REI",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "rei-scan",
      "url": "https://scan.rei.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;