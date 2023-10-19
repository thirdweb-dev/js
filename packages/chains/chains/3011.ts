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
  "icon": {
    "url": "ipfs://bafkreib62bv2d65d7nidojgpkgatrt7smee2l4ov6i6ozqhpfaqsonxku4",
    "width": 512,
    "height": 443,
    "format": "png"
  },
  "infoURL": "https://playa3ull.games",
  "name": "PLAYA3ULL GAMES",
  "nativeCurrency": {
    "name": "3ULL",
    "symbol": "3ULL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://playa3ull-games.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.playa3ull.games"
  ],
  "shortName": "3ULL",
  "slug": "playa3ull-games",
  "testnet": false
} as const satisfies Chain;