import type { Chain } from "../src/types";
export default {
  "chain": "KYOTO",
  "chainId": 1997,
  "explorers": [
    {
      "name": "Kyotoscan",
      "url": "https://kyotoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://kyotoprotocol.io",
  "name": "Kyoto",
  "nativeCurrency": {
    "name": "Kyoto",
    "symbol": "KYOTO",
    "decimals": 18
  },
  "networkId": 1997,
  "rpc": [
    "https://1997.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kyotochain.io"
  ],
  "shortName": "kyoto",
  "slip44": 1,
  "slug": "kyoto",
  "testnet": false
} as const satisfies Chain;