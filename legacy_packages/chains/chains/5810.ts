import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 5810,
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
  "name": "Reg Tnet",
  "nativeCurrency": {
    "name": "Reg Tnet Token",
    "symbol": "LUG",
    "decimals": 18
  },
  "networkId": 5810,
  "redFlags": [],
  "rpc": [
    "https://5810.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Reg Tnet",
  "slug": "reg-tnet",
  "testnet": true
} as const satisfies Chain;