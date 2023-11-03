import type { Chain } from "../types";
export default {
  "chain": "QOM",
  "chainId": 766,
  "explorers": [
    {
      "name": "QL1 Mainnet Explorer",
      "url": "https://mainnet.qom.one",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
        "width": 518,
        "height": 518,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "infoURL": "https://qom.one",
  "name": "QL1",
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "networkId": 766,
  "rpc": [
    "https://ql1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://766.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qom.one"
  ],
  "shortName": "qom",
  "slug": "ql1",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;