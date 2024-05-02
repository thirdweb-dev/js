import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10255,
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
  "name": "Coqnet Testnet",
  "nativeCurrency": {
    "name": "Coqnet Testnet Token",
    "symbol": "COQ",
    "decimals": 18
  },
  "networkId": 10255,
  "redFlags": [],
  "rpc": [
    "https://10255.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/coqnet/testnet/rpc"
  ],
  "shortName": "Coqnet Testnet",
  "slug": "coqnet-testnet",
  "testnet": true
} as const satisfies Chain;