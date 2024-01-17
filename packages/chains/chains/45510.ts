import type { Chain } from "../src/types";
export default {
  "chain": "DEE",
  "chainId": 45510,
  "explorers": [
    {
      "name": "Deelance Mainnet Explorer",
      "url": "https://deescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.deelance.com"
  ],
  "icon": {
    "url": "ipfs://Qmay2j8biuo5xLJL8NcLtrzubAEHuCWz65cdbKE1pSnGf6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://deelance.com",
  "name": "Deelance Mainnet",
  "nativeCurrency": {
    "name": "Deelance",
    "symbol": "DEE",
    "decimals": 18
  },
  "networkId": 45510,
  "rpc": [
    "https://deelance.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://45510.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.deelance.com"
  ],
  "shortName": "dee",
  "slug": "deelance",
  "testnet": false,
  "title": "Deelance Network Mainnet"
} as const satisfies Chain;