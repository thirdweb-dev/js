import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 17026,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QI1204I3",
  "nativeCurrency": {
    "name": "QI1204I3 Token",
    "symbol": "BHOX",
    "decimals": 18
  },
  "networkId": 17026,
  "redFlags": [],
  "rpc": [
    "https://qi1204i3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17026.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-test.io/e7aeac38-06b2-4aaa-87b4-2c2da10fa43e"
  ],
  "shortName": "QI1204I3",
  "slug": "qi1204i3",
  "testnet": true
} as const satisfies Chain;