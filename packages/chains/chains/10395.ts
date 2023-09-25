import type { Chain } from "../src/types";
export default {
  "chainId": 10395,
  "chain": "Worldland",
  "name": "Worldland Testnet",
  "rpc": [
    "https://worldland-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwangju.worldland.foundation"
  ],
  "slug": "worldland-testnet",
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
  "shortName": "TWLC",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://testscan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;