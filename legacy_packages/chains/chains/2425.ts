import type { Chain } from "../src/types";
export default {
  "chain": "KOL",
  "chainId": 2425,
  "explorers": [
    {
      "name": "King Of Legends Devnet Explorer",
      "url": "https://devnet.kingscan.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmTZFXhYJboYE9fbaeje12iTF3QPLn6xgyFgrDVe2isDBH",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTZFXhYJboYE9fbaeje12iTF3QPLn6xgyFgrDVe2isDBH",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://kingoflegends.net/",
  "name": "King Of Legends Devnet",
  "nativeCurrency": {
    "name": "King Of Legends",
    "symbol": "KOL",
    "decimals": 18
  },
  "networkId": 2425,
  "rpc": [
    "https://2425.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet.kinggamer.org/"
  ],
  "shortName": "kol",
  "slip44": 1,
  "slug": "king-of-legends-devnet",
  "testnet": false,
  "title": "King Of Legends Devnet"
} as const satisfies Chain;