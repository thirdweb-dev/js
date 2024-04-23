import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 24010,
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
  "name": "Stealthnet Testing ",
  "nativeCurrency": {
    "name": "Stealthnet Testing  Token",
    "symbol": "AVCLDDEV",
    "decimals": 18
  },
  "networkId": 24010,
  "redFlags": [],
  "rpc": [
    "https://24010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/stealthnet/testnet/rpc"
  ],
  "shortName": "Stealthnet Testing ",
  "slug": "stealthnet-testing",
  "testnet": true
} as const satisfies Chain;