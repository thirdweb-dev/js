import type { Chain } from "../src/types";
export default {
  "name": "PLAYA3ULL GAMES",
  "chain": "3ULL",
  "rpc": [
    "https://playa3ull-games.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.playa3ull.games"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "3ULL",
    "symbol": "3ULL",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://playa3ull.games",
  "shortName": "3ULL",
  "chainId": 3011,
  "networkId": 3011,
  "icon": {
    "url": "ipfs://bafkreib62bv2d65d7nidojgpkgatrt7smee2l4ov6i6ozqhpfaqsonxku4",
    "width": 512,
    "height": 443,
    "format": "png"
  },
  "explorers": [
    {
      "name": "PLAYA3ULL GAMES Explorer",
      "url": "https://3011.routescan.io",
      "icon": {
        "url": "ipfs://bafkreib62bv2d65d7nidojgpkgatrt7smee2l4ov6i6ozqhpfaqsonxku4",
        "width": 512,
        "height": 443,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "playa3ull-games"
} as const satisfies Chain;