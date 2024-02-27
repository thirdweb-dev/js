import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 93625,
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
  "name": "QI0222I2",
  "nativeCurrency": {
    "name": "QI0222I2 Token",
    "symbol": "INK",
    "decimals": 18
  },
  "networkId": 93625,
  "redFlags": [],
  "rpc": [
    "https://93625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0222I2",
  "slug": "qi0222i2",
  "testnet": true
} as const satisfies Chain;