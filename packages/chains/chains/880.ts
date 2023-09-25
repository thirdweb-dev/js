import type { Chain } from "../src/types";
export default {
  "chainId": 880,
  "chain": "ambroschain",
  "name": "Ambros Chain Mainnet",
  "rpc": [
    "https://ambros-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ambros.network"
  ],
  "slug": "ambros-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "AMBROS",
    "symbol": "AMBROS",
    "decimals": 18
  },
  "infoURL": "https://ambros.network",
  "shortName": "ambros",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ambros Chain Explorer",
      "url": "https://ambrosscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;