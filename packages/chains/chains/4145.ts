import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 4145,
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
  "name": "QI1212I2",
  "nativeCurrency": {
    "name": "QI1212I2 Token",
    "symbol": "HSCX",
    "decimals": 18
  },
  "networkId": 4145,
  "redFlags": [],
  "rpc": [
    "https://qi1212i2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4145.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "QI1212I2",
  "slug": "qi1212i2",
  "testnet": true
} as const satisfies Chain;