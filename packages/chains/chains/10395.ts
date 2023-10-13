import type { Chain } from "../src/types";
export default {
  "chain": "Worldland",
  "chainId": 10395,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://testscan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYZNTfK3byhgLsTjXP8vPubVHRz2CWsBrTJxZrQmKq6JZ",
    "width": 3509,
    "height": 2482,
    "format": "png"
  },
  "infoURL": "https://worldland.foundation",
  "name": "Worldland Testnet",
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://worldland-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwangju.worldland.foundation"
  ],
  "shortName": "TWLC",
  "slug": "worldland-testnet",
  "testnet": true
} as const satisfies Chain;