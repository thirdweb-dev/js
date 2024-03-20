import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 28106,
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
  "name": "Mezzanine Testnet",
  "nativeCurrency": {
    "name": "Mezzanine Testnet Token",
    "symbol": "OWQ",
    "decimals": 18
  },
  "networkId": 28106,
  "redFlags": [],
  "rpc": [
    "https://28106.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mezzaninet/testnet/rpc"
  ],
  "shortName": "Mezzanine Testnet",
  "slug": "mezzanine-testnet",
  "testnet": true
} as const satisfies Chain;