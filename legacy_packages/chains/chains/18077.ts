import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 18077,
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
  "name": "PlayGround",
  "nativeCurrency": {
    "name": "PlayGround Token",
    "symbol": "PG",
    "decimals": 18
  },
  "networkId": 18077,
  "redFlags": [],
  "rpc": [
    "https://18077.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/playground/testnet/rpc"
  ],
  "shortName": "PlayGround",
  "slug": "playground",
  "testnet": true
} as const satisfies Chain;