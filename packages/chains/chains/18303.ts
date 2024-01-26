import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 18303,
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
  "name": "Zeroone Testnet",
  "nativeCurrency": {
    "name": "Zeroone Testnet Token",
    "symbol": "ZERO",
    "decimals": 18
  },
  "networkId": 18303,
  "redFlags": [],
  "rpc": [
    "https://zeroone-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://18303.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/zeroonetes/testnet/rpc"
  ],
  "shortName": "Zeroone Testnet",
  "slug": "zeroone-testnet",
  "testnet": true
} as const satisfies Chain;