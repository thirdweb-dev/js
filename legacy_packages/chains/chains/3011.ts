import type { Chain } from "../src/types";
export default {
  "chain": "3ULL",
  "chainId": 3011,
  "explorers": [
    {
      "name": "PLAYA3ULL GAMES Explorer",
      "url": "https://3011.routescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://playa3ull.games",
  "name": "PLAYA3ULL GAMES",
  "nativeCurrency": {
    "name": "3ULL",
    "symbol": "3ULL",
    "decimals": 18
  },
  "networkId": 3011,
  "rpc": [
    "https://3011.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.playa3ull.games"
  ],
  "shortName": "3ULL",
  "slug": "playa3ull-games",
  "testnet": false
} as const satisfies Chain;