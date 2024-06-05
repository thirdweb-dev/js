import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 57487,
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
  "name": "PTNEWLO",
  "nativeCurrency": {
    "name": "PTNEWLO Token",
    "symbol": "PTNL",
    "decimals": 18
  },
  "networkId": 57487,
  "redFlags": [],
  "rpc": [
    "https://57487.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/ptnewlo/testnet/rpc"
  ],
  "shortName": "PTNEWLO",
  "slug": "ptnewlo",
  "testnet": true
} as const satisfies Chain;