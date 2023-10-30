import type { Chain } from "../src/types";
export default {
  "chain": "P12",
  "chainId": 20736,
  "explorers": [
    {
      "name": "P12 Chain Explorer",
      "url": "https://explorer.p12.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreieiro4imoujeewc4r4thf5hxj47l56j2iwuz6d6pdj6ieb6ub3h7e",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://p12.network",
  "name": "P12 Chain",
  "nativeCurrency": {
    "name": "Hooked P2",
    "symbol": "hP2",
    "decimals": 18
  },
  "networkId": 20736,
  "rpc": [
    "https://p12-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://20736.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-chain.p12.games"
  ],
  "shortName": "p12",
  "slug": "p12-chain",
  "testnet": false
} as const satisfies Chain;