import type { Chain } from "../src/types";
export default {
  "chain": "EVA",
  "chainId": 2213,
  "explorers": [
    {
      "name": "Evanesco Explorer",
      "url": "https://explorer.evanesco.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZbmGYdfbMRrWJore3c7hyD6q7B5pXHJqTSNjbZZUK6V8",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://evanesco.org/",
  "name": "Evanesco Mainnet",
  "nativeCurrency": {
    "name": "EVA",
    "symbol": "EVA",
    "decimals": 18
  },
  "networkId": 2213,
  "rpc": [
    "https://2213.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed4.evanesco.org:8546"
  ],
  "shortName": "evanesco",
  "slug": "evanesco",
  "testnet": false
} as const satisfies Chain;