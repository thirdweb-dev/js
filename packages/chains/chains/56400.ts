import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 56400,
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
  "name": "Testnet Zeroone",
  "nativeCurrency": {
    "name": "Testnet Zeroone Token",
    "symbol": "ZERO",
    "decimals": 18
  },
  "networkId": 56400,
  "redFlags": [],
  "rpc": [
    "https://56400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/testnetzer/testnet/rpc"
  ],
  "shortName": "Testnet Zeroone",
  "slug": "testnet-zeroone",
  "testnet": true
} as const satisfies Chain;