import type { Chain } from "../src/types";
export default {
  "chainId": 800001,
  "chain": "OCTA",
  "name": "OctaSpace",
  "rpc": [
    "https://octaspace.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octa.space",
    "wss://rpc.octa.space"
  ],
  "slug": "octaspace",
  "icon": {
    "url": "ipfs://QmVhezQHkqSZ5Tvtsw18giA1yBjV1URSsBQ7HenUh6p6oC",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OctaSpace",
    "symbol": "OCTA",
    "decimals": 18
  },
  "infoURL": "https://octa.space",
  "shortName": "octa",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.octa.space",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;