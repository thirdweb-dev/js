import type { Chain } from "../src/types";
export default {
  "chainId": 592,
  "chain": "ASTR",
  "name": "Astar",
  "rpc": [
    "https://astar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.astar.network",
    "https://rpc.astar.network:8545"
  ],
  "slug": "astar",
  "icon": {
    "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Astar",
    "symbol": "ASTR",
    "decimals": 18
  },
  "infoURL": "https://astar.network/",
  "shortName": "astr",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://astar.subscan.io",
      "standard": "none"
    },
    {
      "name": "blockscout",
      "url": "https://blockscout.com/astar",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;