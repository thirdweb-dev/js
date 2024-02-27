import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 82552,
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
  "name": "QI0209I2",
  "nativeCurrency": {
    "name": "QI0209I2 Token",
    "symbol": "BLOX",
    "decimals": 18
  },
  "networkId": 82552,
  "redFlags": [],
  "rpc": [
    "https://82552.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0209I2",
  "slug": "qi0209i2",
  "testnet": true
} as const satisfies Chain;