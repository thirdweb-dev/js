import type { Chain } from "../src/types";
export default {
  "chain": "METAD",
  "chainId": 2122,
  "explorers": [
    {
      "name": "Metad Scan",
      "url": "https://scan.metaplayer.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZyxS9BfRGYWWDtvrV6qtthCYV4TwdjLoH2sF6MkiTYFf",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://docs.metaplayer.one/",
  "name": "Metaplayerone Mainnet",
  "nativeCurrency": {
    "name": "METAD",
    "symbol": "METAD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metaplayerone.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metaplayer.one/"
  ],
  "shortName": "Metad",
  "slug": "metaplayerone",
  "testnet": false
} as const satisfies Chain;