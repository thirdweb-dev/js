import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10671,
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
  "name": "QI M 12131",
  "nativeCurrency": {
    "name": "QI M 12131 Token",
    "symbol": "XVL",
    "decimals": 18
  },
  "networkId": 10671,
  "redFlags": [],
  "rpc": [
    "https://10671.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/c3c8cc74-5101-4380-937f-4f534cad0128"
  ],
  "shortName": "QI M 12131",
  "slug": "qi-m-12131",
  "testnet": true
} as const satisfies Chain;