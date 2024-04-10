import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 47157,
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
  "name": "Avaland Testnet",
  "nativeCurrency": {
    "name": "Avaland Testnet Token",
    "symbol": "AVA",
    "decimals": 18
  },
  "networkId": 47157,
  "redFlags": [],
  "rpc": [
    "https://47157.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/avalandtes/testnet/rpc"
  ],
  "shortName": "Avaland Testnet",
  "slug": "avaland-testnet",
  "testnet": true
} as const satisfies Chain;