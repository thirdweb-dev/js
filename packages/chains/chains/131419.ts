import type { Chain } from "../src/types";
export default {
  "chainId": 131419,
  "chain": "ETND",
  "name": "ETND Chain Mainnets",
  "rpc": [
    "https://etnd-chain-s.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.node1.etnd.pro/"
  ],
  "slug": "etnd-chain-s",
  "icon": {
    "url": "ipfs://Qmd26eRJxPb1jJg5Q4mC2M4kD9Jrs5vmcnr5LczHFMGwSD",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ETND",
    "symbol": "ETND",
    "decimals": 18
  },
  "infoURL": "https://www.etnd.pro",
  "shortName": "ETND",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "etndscan",
      "url": "https://scan.etnd.pro",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;