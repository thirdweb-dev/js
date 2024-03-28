import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 151221,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Xantus",
  "nativeCurrency": {
    "name": "Xantus Token",
    "symbol": "XAN",
    "decimals": 18
  },
  "networkId": 151221,
  "redFlags": [],
  "rpc": [
    "https://151221.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/xantus/testnet/rpc"
  ],
  "shortName": "Xantus",
  "slug": "xantus",
  "testnet": true
} as const satisfies Chain;