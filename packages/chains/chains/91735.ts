import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 91735,
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
  "name": "QI1228I2",
  "nativeCurrency": {
    "name": "QI1228I2 Token",
    "symbol": "ZMY",
    "decimals": 18
  },
  "networkId": 91735,
  "redFlags": [],
  "rpc": [
    "https://qi1228i2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://91735.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f51649a9-3420-4636-bb44-206f63998951"
  ],
  "shortName": "QI1228I2",
  "slug": "qi1228i2",
  "testnet": true
} as const satisfies Chain;