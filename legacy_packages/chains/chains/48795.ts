import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 48795,
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
  "name": "Space",
  "nativeCurrency": {
    "name": "Space Token",
    "symbol": "FUEL",
    "decimals": 18
  },
  "networkId": 48795,
  "redFlags": [],
  "rpc": [
    "https://48795.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/space/testnet/rpc"
  ],
  "shortName": "Space",
  "slug": "space",
  "testnet": true
} as const satisfies Chain;