import type { Chain } from "../src/types";
export default {
  "name": "OctaSpace",
  "chain": "OCTA",
  "rpc": [
    "https://octaspace.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octa.space",
    "wss://rpc.octa.space"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OctaSpace",
    "symbol": "OCTA",
    "decimals": 18
  },
  "infoURL": "https://octa.space",
  "shortName": "octa",
  "chainId": 800001,
  "networkId": 800001,
  "icon": {
    "url": "ipfs://QmVhezQHkqSZ5Tvtsw18giA1yBjV1URSsBQ7HenUh6p6oC",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.octa.space",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "octaspace"
} as const satisfies Chain;