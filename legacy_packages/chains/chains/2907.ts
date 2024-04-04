import type { Chain } from "../src/types";
export default {
  "chain": "ELUX",
  "chainId": 2907,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://eluxscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQC7LzzFj8kL71a1MXRgn3TSeRrgF1tTuVEzvWx5cQjv1",
    "width": 114,
    "height": 132,
    "format": "png"
  },
  "infoURL": "https://eluxscan.com",
  "name": "Elux Chain",
  "nativeCurrency": {
    "name": "Elux Chain",
    "symbol": "ELUX",
    "decimals": 18
  },
  "networkId": 2907,
  "rpc": [
    "https://2907.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eluxscan.com"
  ],
  "shortName": "ELUX",
  "slug": "elux-chain",
  "testnet": false
} as const satisfies Chain;