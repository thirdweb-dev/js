import type { Chain } from "../src/types";
export default {
  "chain": "ETND",
  "chainId": 131419,
  "explorers": [
    {
      "name": "etndscan",
      "url": "https://scan.etnd.pro",
      "standard": "none",
      "icon": {
        "url": "ipfs://Qmd26eRJxPb1jJg5Q4mC2M4kD9Jrs5vmcnr5LczHFMGwSD",
        "width": 128,
        "height": 128,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmd26eRJxPb1jJg5Q4mC2M4kD9Jrs5vmcnr5LczHFMGwSD",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://www.etnd.pro",
  "name": "ETND Chain Mainnets",
  "nativeCurrency": {
    "name": "ETND",
    "symbol": "ETND",
    "decimals": 18
  },
  "networkId": 131419,
  "rpc": [
    "https://131419.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.node1.etnd.pro/"
  ],
  "shortName": "ETND",
  "slug": "etnd-chain-s",
  "testnet": false
} as const satisfies Chain;