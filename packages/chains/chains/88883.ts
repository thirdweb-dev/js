import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 88883,
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
  "name": "Proj Orc Testnet Alpha",
  "nativeCurrency": {
    "name": "Proj Orc Testnet Alpha Token",
    "symbol": "STX",
    "decimals": 18
  },
  "networkId": 88883,
  "redFlags": [],
  "rpc": [
    "https://88883.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/projorctes/testnet/rpc"
  ],
  "shortName": "Proj Orc Testnet Alpha",
  "slug": "proj-orc-testnet-alpha",
  "testnet": true
} as const satisfies Chain;