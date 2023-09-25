import type { Chain } from "../src/types";
export default {
  "chainId": 20736,
  "chain": "P12",
  "name": "P12 Chain",
  "rpc": [
    "https://p12-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-chain.p12.games"
  ],
  "slug": "p12-chain",
  "icon": {
    "url": "ipfs://bafkreieiro4imoujeewc4r4thf5hxj47l56j2iwuz6d6pdj6ieb6ub3h7e",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Hooked P2",
    "symbol": "hP2",
    "decimals": 18
  },
  "infoURL": "https://p12.network",
  "shortName": "p12",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "P12 Chain Explorer",
      "url": "https://explorer.p12.games",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;