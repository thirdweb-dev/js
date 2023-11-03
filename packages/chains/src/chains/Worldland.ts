import type { Chain } from "../types";
export default {
  "chain": "Worldland",
  "chainId": 103,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://scan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYZNTfK3byhgLsTjXP8vPubVHRz2CWsBrTJxZrQmKq6JZ",
    "width": 3509,
    "height": 2482,
    "format": "png"
  },
  "infoURL": "https://worldland.foundation",
  "name": "Worldland Mainnet",
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "networkId": 103,
  "rpc": [
    "https://worldland.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seoul.worldland.foundation"
  ],
  "shortName": "WLC",
  "slug": "worldland",
  "testnet": false
} as const satisfies Chain;