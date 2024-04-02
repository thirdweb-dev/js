import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 3084,
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
  "name": "XL Network Testnet",
  "nativeCurrency": {
    "name": "XL Network Testnet Token",
    "symbol": "XLN",
    "decimals": 18
  },
  "networkId": 3084,
  "redFlags": [],
  "rpc": [
    "https://3084.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/xlnetworkt/testnet/rpc"
  ],
  "shortName": "XL Network Testnet",
  "slug": "xl-network-testnet",
  "testnet": true
} as const satisfies Chain;