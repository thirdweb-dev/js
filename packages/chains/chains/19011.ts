import type { Chain } from "../src/types";
export default {
  "chainId": 19011,
  "chain": "HOME Verse",
  "name": "HOME Verse Mainnet",
  "rpc": [
    "https://home-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.homeverse.games/"
  ],
  "slug": "home-verse",
  "icon": {
    "url": "ipfs://QmeGb65zSworzoHmwK3jdkPtEsQZMUSJRxf8K8Feg56soU",
    "width": 597,
    "height": 597,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.homeverse.games/",
  "shortName": "HMV",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "HOME Verse Explorer",
      "url": "https://explorer.oasys.homeverse.games",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;