import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 79466,
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
  "name": "QI0513I2",
  "nativeCurrency": {
    "name": "QI0513I2 Token",
    "symbol": "YSC",
    "decimals": 18
  },
  "networkId": 79466,
  "redFlags": [],
  "rpc": [
    "https://79466.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI0513I2",
  "slug": "qi0513i2",
  "testnet": true
} as const satisfies Chain;