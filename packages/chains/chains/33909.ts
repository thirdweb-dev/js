import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 33909,
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
  "name": "Reg1116test",
  "nativeCurrency": {
    "name": "Reg1116test Token",
    "symbol": "JUO",
    "decimals": 18
  },
  "networkId": 33909,
  "redFlags": [],
  "rpc": [
    "https://reg1116test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://33909.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Reg1116test",
  "slug": "reg1116test",
  "testnet": true
} as const satisfies Chain;