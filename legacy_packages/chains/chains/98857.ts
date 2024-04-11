import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 98857,
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
  "name": "Thetan Testnet",
  "nativeCurrency": {
    "name": "Thetan Testnet Token",
    "symbol": "THG",
    "decimals": 18
  },
  "networkId": 98857,
  "redFlags": [],
  "rpc": [
    "https://98857.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/thetantest/testnet/rpc"
  ],
  "shortName": "Thetan Testnet",
  "slug": "thetan-testnet",
  "testnet": true
} as const satisfies Chain;