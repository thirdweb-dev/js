import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 17511,
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
  "name": "PST 1-17-24",
  "nativeCurrency": {
    "name": "PST 1-17-24 Token",
    "symbol": "MUB",
    "decimals": 18
  },
  "networkId": 17511,
  "redFlags": [],
  "rpc": [
    "https://17511.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "PST 1-17-24",
  "slug": "pst-1-17-24",
  "testnet": true
} as const satisfies Chain;