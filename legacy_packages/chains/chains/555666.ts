import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 555666,
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
  "name": "EclipseChain Testnet",
  "nativeCurrency": {
    "name": "EclipseChain Testnet Token",
    "symbol": "ECLPS",
    "decimals": 18
  },
  "networkId": 555666,
  "redFlags": [],
  "rpc": [
    "https://555666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/eclipsecha/testnet/rpc"
  ],
  "shortName": "EclipseChain Testnet",
  "slug": "eclipsechain-testnet",
  "testnet": true
} as const satisfies Chain;