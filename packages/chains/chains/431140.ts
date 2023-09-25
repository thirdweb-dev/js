import type { Chain } from "../src/types";
export default {
  "chainId": 431140,
  "chain": "Unified",
  "name": "Markr Go",
  "rpc": [
    "https://markr-go.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.markr.io/ext/"
  ],
  "slug": "markr-go",
  "icon": {
    "url": "ipfs://QmVMBTZVPawyLBD2B5VbG68dfWLfZ1CnB8V59xduBe2kwh",
    "width": 84,
    "height": 84,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://www.markr.io/",
  "shortName": "markr-go",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;