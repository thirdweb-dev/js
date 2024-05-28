import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 88945,
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
  "name": "SwapTest",
  "nativeCurrency": {
    "name": "SwapTest Token",
    "symbol": "ZQG",
    "decimals": 18
  },
  "networkId": 88945,
  "redFlags": [],
  "rpc": [
    "https://88945.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/swaptest/testnet/rpc"
  ],
  "shortName": "SwapTest",
  "slug": "swaptest",
  "testnet": true
} as const satisfies Chain;