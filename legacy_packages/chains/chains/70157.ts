import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 70157,
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
  "name": "jonoperf",
  "nativeCurrency": {
    "name": "jonoperf Token",
    "symbol": "JONO",
    "decimals": 18
  },
  "networkId": 70157,
  "redFlags": [],
  "rpc": [
    "https://70157.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jonoperf/testnet/rpc"
  ],
  "shortName": "jonoperf",
  "slug": "jonoperf",
  "testnet": true
} as const satisfies Chain;