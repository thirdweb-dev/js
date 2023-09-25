import type { Chain } from "../src/types";
export default {
  "chainId": 3011,
  "chain": "3ULL",
  "name": "PLAYA3ULL GAMES",
  "rpc": [
    "https://playa3ull-games.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.playa3ull.games"
  ],
  "slug": "playa3ull-games",
  "icon": {
    "url": "ipfs://bafkreib62bv2d65d7nidojgpkgatrt7smee2l4ov6i6ozqhpfaqsonxku4",
    "width": 512,
    "height": 443,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "3ULL",
    "symbol": "3ULL",
    "decimals": 18
  },
  "infoURL": "https://playa3ull.games",
  "shortName": "3ULL",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "PLAYA3ULL GAMES Explorer",
      "url": "https://3011.routescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;