import type { Chain } from "../src/types";
export default {
  "name": "Ambros Chain Mainnet",
  "chain": "ambroschain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "AMBROS",
    "symbol": "AMBROS",
    "decimals": 18
  },
  "infoURL": "https://ambros.network",
  "shortName": "ambros",
  "chainId": 880,
  "networkId": 880,
  "explorers": [
    {
      "name": "Ambros Chain Explorer",
      "url": "https://ambrosscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ambros-chain"
} as const satisfies Chain;