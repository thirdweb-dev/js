import type { Chain } from "../types";
export default {
  "chain": "QOM",
  "chainId": 7668378,
  "explorers": [
    {
      "name": "QL1 Testnet Explorer",
      "url": "https://testnet.qom.one",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
        "width": 518,
        "height": 518,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.qom.one"
  ],
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "infoURL": "https://qom.one",
  "name": "QL1 Testnet",
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "networkId": 7668378,
  "rpc": [
    "https://ql1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7668378.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.qom.one"
  ],
  "shortName": "tqom",
  "slug": "ql1-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;