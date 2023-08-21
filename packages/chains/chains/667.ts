import type { Chain } from "../src/types";
export default {
  "name": "LAOS Arrakis",
  "title": "LAOS Testnet Arrakis",
  "chain": "LAOS",
  "icon": {
    "url": "ipfs://QmZ4YYcvhcaeotMPaGXC5Vab7JFaVkka37V8TiTJpT7Mak",
    "width": 586,
    "height": 558,
    "format": "png"
  },
  "rpc": [
    "https://laos-arrakis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arrakis.gorengine.com/own",
    "wss://arrakis.gorengine.com/own"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAOS",
    "symbol": "LAOS",
    "decimals": 18
  },
  "infoURL": "https://www.laosfoundation.io/",
  "shortName": "laos",
  "chainId": 667,
  "networkId": 667,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arrakis.gorengine.com",
      "icon": {
        "url": "ipfs://QmZ4YYcvhcaeotMPaGXC5Vab7JFaVkka37V8TiTJpT7Mak",
        "width": 586,
        "height": 558,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "laos-arrakis"
} as const satisfies Chain;