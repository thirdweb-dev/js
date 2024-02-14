import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 46092,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QI0213I1",
  "nativeCurrency": {
    "name": "QI0213I1 Token",
    "symbol": "ORR",
    "decimals": 18
  },
  "networkId": 46092,
  "redFlags": [],
  "rpc": [
    "https://qi0213i1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://46092.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/f0aae4b1-a373-43ed-9e61-ba61d42131bb"
  ],
  "shortName": "QI0213I1",
  "slug": "qi0213i1",
  "testnet": true
} as const satisfies Chain;