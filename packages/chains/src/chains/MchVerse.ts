import type { Chain } from "../types";
export default {
  "chain": "MCH Verse",
  "chainId": 29548,
  "explorers": [
    {
      "name": "MCH Verse Explorer",
      "url": "https://explorer.oasys.mycryptoheroes.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZZnwR1y6cU1sare2TQmwqkNDLXQxD4GdPrmHLmUoPtbU",
    "width": 4000,
    "height": 4000,
    "format": "png"
  },
  "infoURL": "https://www.mycryptoheroes.net/verse",
  "name": "MCH Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 29548,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://mch-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://29548.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oasys.mycryptoheroes.net"
  ],
  "shortName": "MCHV",
  "slug": "mch-verse",
  "testnet": false
} as const satisfies Chain;