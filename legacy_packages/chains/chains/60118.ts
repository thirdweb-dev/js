import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 60118,
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
  "name": "Lith",
  "nativeCurrency": {
    "name": "Lith Token",
    "symbol": "NXPC",
    "decimals": 18
  },
  "networkId": 60118,
  "redFlags": [],
  "rpc": [
    "https://60118.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lith/testnet/rpc"
  ],
  "shortName": "Lith",
  "slug": "lith",
  "testnet": true
} as const satisfies Chain;