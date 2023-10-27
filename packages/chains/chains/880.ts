import type { Chain } from "../src/types";
export default {
  "chain": "ambroschain",
  "chainId": 880,
  "explorers": [
    {
      "name": "Ambros Chain Explorer",
      "url": "https://ambrosscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://ambros.network",
  "name": "Ambros Chain Mainnet",
  "nativeCurrency": {
    "name": "AMBROS",
    "symbol": "AMBROS",
    "decimals": 18
  },
  "networkId": 880,
  "rpc": [
    "https://ambros-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://880.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ambros.network"
  ],
  "shortName": "ambros",
  "slug": "ambros-chain",
  "testnet": false
} as const satisfies Chain;