import type { Chain } from "../src/types";
export default {
  "chain": "OCTA",
  "chainId": 800001,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.octa.space",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVhezQHkqSZ5Tvtsw18giA1yBjV1URSsBQ7HenUh6p6oC",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://octa.space",
  "name": "OctaSpace",
  "nativeCurrency": {
    "name": "OctaSpace",
    "symbol": "OCTA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://octaspace.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octa.space",
    "wss://rpc.octa.space"
  ],
  "shortName": "octa",
  "slug": "octaspace",
  "testnet": false
} as const satisfies Chain;