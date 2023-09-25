import type { Chain } from "../src/types";
export default {
  "chainId": 42888,
  "chain": "ETH",
  "name": "Kinto Testnet",
  "rpc": [
    "https://kinto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://35.215.120.180:8545"
  ],
  "slug": "kinto-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "keth",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "kintoscan",
      "url": "http://35.215.120.180:4000",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;