import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 63891,
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
  "name": "Tnetv2",
  "nativeCurrency": {
    "name": "Tnetv2 Token",
    "symbol": "LFC",
    "decimals": 18
  },
  "networkId": 63891,
  "redFlags": [],
  "rpc": [
    "https://63891.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Tnetv2",
  "slug": "tnetv2",
  "testnet": true
} as const satisfies Chain;