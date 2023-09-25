import type { Chain } from "../src/types";
export default {
  "chainId": 667,
  "chain": "LAOS",
  "name": "LAOS Arrakis",
  "rpc": [
    "https://laos-arrakis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arrakis.gorengine.com/own",
    "wss://arrakis.gorengine.com/own"
  ],
  "slug": "laos-arrakis",
  "icon": {
    "url": "ipfs://QmZ4YYcvhcaeotMPaGXC5Vab7JFaVkka37V8TiTJpT7Mak",
    "width": 586,
    "height": 558,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LAOS",
    "symbol": "LAOS",
    "decimals": 18
  },
  "infoURL": "https://www.laosfoundation.io/",
  "shortName": "laos",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arrakis.gorengine.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;