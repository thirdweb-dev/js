import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 234560,
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
  "name": "Project Orc",
  "nativeCurrency": {
    "name": "Project Orc Token",
    "symbol": "STX",
    "decimals": 18
  },
  "networkId": 234560,
  "redFlags": [],
  "rpc": [
    "https://234560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/projectorc/testnet/rpc"
  ],
  "shortName": "Project Orc",
  "slug": "project-orc",
  "testnet": true
} as const satisfies Chain;