import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 78170,
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
  "name": "MXS Games Testnet",
  "nativeCurrency": {
    "name": "MXS Games Testnet Token",
    "symbol": "XSEED",
    "decimals": 18
  },
  "networkId": 78170,
  "redFlags": [],
  "rpc": [
    "https://78170.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mxsgameste/testnet/rpc"
  ],
  "shortName": "MXS Games Testnet",
  "slug": "mxs-games-testnet",
  "testnet": true
} as const satisfies Chain;