import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 72709,
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
  "name": "Dragon Testnet",
  "nativeCurrency": {
    "name": "Dragon Testnet Token",
    "symbol": "BDI",
    "decimals": 18
  },
  "networkId": 72709,
  "redFlags": [],
  "rpc": [
    "https://72709.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dragontest/testnet/rpc"
  ],
  "shortName": "Dragon Testnet",
  "slug": "dragon-testnet",
  "testnet": true
} as const satisfies Chain;