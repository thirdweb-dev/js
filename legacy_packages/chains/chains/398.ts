import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 398,
  "explorers": [
    {
      "name": "Near blocks",
      "url": "https://testnet.nearblocks.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreiayxzdbu3e5ahri3ooieg6k6pjxrwkrkc2x5cnyadqeu5zbmaummq",
    "width": 639,
    "height": 639,
    "format": "png"
  },
  "infoURL": "https://aurora.dev",
  "name": "Near Testnet",
  "nativeCurrency": {
    "name": "Testnet NEAR",
    "symbol": "NEAR",
    "decimals": 18
  },
  "networkId": 398,
  "rpc": [],
  "shortName": "near-testnet",
  "slug": "near-testnet",
  "testnet": true
} as const satisfies Chain;