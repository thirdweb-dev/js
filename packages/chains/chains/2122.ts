import type { Chain } from "../src/types";
export default {
  "chainId": 2122,
  "chain": "METAD",
  "name": "Metaplayerone Mainnet",
  "rpc": [
    "https://metaplayerone.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metaplayer.one/"
  ],
  "slug": "metaplayerone",
  "icon": {
    "url": "ipfs://QmZyxS9BfRGYWWDtvrV6qtthCYV4TwdjLoH2sF6MkiTYFf",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "METAD",
    "symbol": "METAD",
    "decimals": 18
  },
  "infoURL": "https://docs.metaplayer.one/",
  "shortName": "Metad",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Metad Scan",
      "url": "https://scan.metaplayer.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;