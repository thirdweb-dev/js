import type { Chain } from "../src/types";
export default {
  "chain": "Xterio Testnet",
  "chainId": 1637450,
  "explorers": [
    {
      "name": "Xterio Testnet Explorer",
      "url": "https://testnet.xterscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://xter.io",
  "name": "Xterio Testnet",
  "nativeCurrency": {
    "name": "tBNB",
    "symbol": "tBNB",
    "decimals": 18
  },
  "networkId": 1637450,
  "rpc": [
    "https://1637450.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xterio-testnet.alt.technology"
  ],
  "shortName": "xteriotest",
  "slug": "xterio-testnet",
  "testnet": true
} as const satisfies Chain;