import type { Chain } from "../src/types";
export default {
  "chainId": 766,
  "chain": "QOM",
  "name": "QL1",
  "rpc": [
    "https://ql1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qom.one"
  ],
  "slug": "ql1",
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "shortName": "qom",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "QL1 Mainnet Explorer",
      "url": "https://mainnet.qom.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;