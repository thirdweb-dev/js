import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 30406,
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
  "name": "MUGEN Testnet",
  "nativeCurrency": {
    "name": "MUGEN Testnet Token",
    "symbol": "MGN",
    "decimals": 18
  },
  "networkId": 30406,
  "redFlags": [],
  "rpc": [
    "https://30406.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mugen/testnet/rpc"
  ],
  "shortName": "MUGEN Testnet",
  "slug": "mugen-testnet",
  "testnet": true
} as const satisfies Chain;