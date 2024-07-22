import type { Chain } from "../src/types";
export default {
  "chain": "KCC",
  "chainId": 2425,
  "explorers": [
    {
      "name": "King Of Legends Mainnet Explorer",
      "url": "https://kingscan.org",
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
  "name": "King Of Legends Mainnet",
  "nativeCurrency": {
    "name": "King Of Legends",
    "symbol": "KCC",
    "decimals": 18
  },
  "networkId": 2425,
  "rpc": [
    "https://2425.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.kinggamer.org/"
  ],
  "shortName": "kcc",
  "slip44": 1,
  "slug": "king-of-legends",
  "testnet": false,
  "title": "King Of Legends Mainnet"
} as const satisfies Chain;