import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 96040,
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
  "name": "FIZIT",
  "nativeCurrency": {
    "name": "FIZIT Token",
    "symbol": "FIZIT",
    "decimals": 18
  },
  "networkId": 96040,
  "redFlags": [],
  "rpc": [
    "https://96040.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/fizit/testnet/rpc"
  ],
  "shortName": "FIZIT",
  "slug": "fizit",
  "testnet": true
} as const satisfies Chain;