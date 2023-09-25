import type { Chain } from "../src/types";
export default {
  "chainId": 2213,
  "chain": "EVA",
  "name": "Evanesco Mainnet",
  "rpc": [
    "https://evanesco.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed4.evanesco.org:8546"
  ],
  "slug": "evanesco",
  "icon": {
    "url": "ipfs://QmZbmGYdfbMRrWJore3c7hyD6q7B5pXHJqTSNjbZZUK6V8",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EVA",
    "symbol": "EVA",
    "decimals": 18
  },
  "infoURL": "https://evanesco.org/",
  "shortName": "evanesco",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Evanesco Explorer",
      "url": "https://explorer.evanesco.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;