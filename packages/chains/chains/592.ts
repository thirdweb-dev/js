import type { Chain } from "../src/types";
export default {
  "chain": "ASTR",
  "chainId": 592,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/astar",
      "standard": "EIP3091"
    },
    {
      "name": "subscan",
      "url": "https://astar.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://astar.network/",
  "name": "Astar",
  "nativeCurrency": {
    "name": "Astar",
    "symbol": "ASTR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://astar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.astar.network",
    "https://rpc.astar.network:8545"
  ],
  "shortName": "astr",
  "slug": "astar",
  "testnet": false
} as const satisfies Chain;