import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 42888,
  "explorers": [
    {
      "name": "kintoscan",
      "url": "http://35.215.120.180:4000",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://ethereum.org",
  "name": "Kinto Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 42888,
  "rpc": [
    "https://42888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://35.215.120.180:8545"
  ],
  "shortName": "keth",
  "slip44": 1,
  "slug": "kinto-testnet",
  "testnet": true,
  "title": "Kinto Testnet"
} as const satisfies Chain;