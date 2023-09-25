import type { Chain } from "../src/types";
export default {
  "chainId": 103,
  "chain": "Worldland",
  "name": "Worldland Mainnet",
  "rpc": [
    "https://worldland.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seoul.worldland.foundation"
  ],
  "slug": "worldland",
  "icon": {
    "url": "ipfs://QmYZNTfK3byhgLsTjXP8vPubVHRz2CWsBrTJxZrQmKq6JZ",
    "width": 3509,
    "height": 2482,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "infoURL": "https://worldland.foundation",
  "shortName": "WLC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://scan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;