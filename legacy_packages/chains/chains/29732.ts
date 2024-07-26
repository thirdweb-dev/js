import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 29732,
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
  "name": "Deboard",
  "nativeCurrency": {
    "name": "Deboard Token",
    "symbol": "DEVAX",
    "decimals": 18
  },
  "networkId": 29732,
  "redFlags": [],
  "rpc": [
    "https://29732.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/deboard/mainnet/rpc"
  ],
  "shortName": "Deboard",
  "slug": "deboard",
  "testnet": false
} as const satisfies Chain;