import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 95549,
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
  "name": "Borne Testnet Testnet",
  "nativeCurrency": {
    "name": "Borne Testnet Testnet Token",
    "symbol": "BORNE",
    "decimals": 18
  },
  "networkId": 95549,
  "redFlags": [],
  "rpc": [
    "https://95549.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/borne/testnet/rpc"
  ],
  "shortName": "Borne Testnet Testnet",
  "slug": "borne-testnet-testnet",
  "testnet": true
} as const satisfies Chain;