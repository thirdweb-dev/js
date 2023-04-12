import type { Chain } from "../src/types";
export default {
  "name": "Markr Go",
  "chain": "Unified",
  "icon": {
    "url": "ipfs://QmVMBTZVPawyLBD2B5VbG68dfWLfZ1CnB8V59xduBe2kwh",
    "width": 84,
    "height": 84,
    "format": "png"
  },
  "rpc": [
    "https://markr-go.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.markr.io/ext/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://www.markr.io/",
  "shortName": "markr-go",
  "chainId": 431140,
  "networkId": 431140,
  "explorers": [],
  "status": "incubating",
  "testnet": false,
  "slug": "markr-go"
} as const satisfies Chain;