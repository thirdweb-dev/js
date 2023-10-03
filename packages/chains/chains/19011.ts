import type { Chain } from "../src/types";
export default {
  "chain": "HOME Verse",
  "chainId": 19011,
  "explorers": [
    {
      "name": "HOME Verse Explorer",
      "url": "https://explorer.oasys.homeverse.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmeGb65zSworzoHmwK3jdkPtEsQZMUSJRxf8K8Feg56soU",
    "width": 597,
    "height": 597,
    "format": "png"
  },
  "infoURL": "https://www.homeverse.games/",
  "name": "HOME Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://home-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.homeverse.games/"
  ],
  "shortName": "HMV",
  "slug": "home-verse",
  "testnet": false
} as const satisfies Chain;