import type { Chain } from "../src/types";
export default {
  "chain": "LAOS",
  "chainId": 667,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arrakis.gorengine.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZ4YYcvhcaeotMPaGXC5Vab7JFaVkka37V8TiTJpT7Mak",
    "width": 586,
    "height": 558,
    "format": "png"
  },
  "infoURL": "https://www.laosfoundation.io/",
  "name": "LAOS Arrakis",
  "nativeCurrency": {
    "name": "LAOS",
    "symbol": "LAOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://laos-arrakis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arrakis.gorengine.com/own",
    "wss://arrakis.gorengine.com/own"
  ],
  "shortName": "laos",
  "slug": "laos-arrakis",
  "testnet": true
} as const satisfies Chain;