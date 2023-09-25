import type { Chain } from "../src/types";
export default {
  "chainId": 7668378,
  "chain": "QOM",
  "name": "QL1 Testnet",
  "rpc": [
    "https://ql1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.qom.one"
  ],
  "slug": "ql1-testnet",
  "icon": {
    "url": "ipfs://QmRc1kJ7AgcDL1BSoMYudatWHTrz27K6WNTwGifQb5V17D",
    "width": 518,
    "height": 518,
    "format": "png"
  },
  "faucets": [
    "https://faucet.qom.one"
  ],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "shortName": "tqom",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "QL1 Testnet Explorer",
      "url": "https://testnet.qom.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;