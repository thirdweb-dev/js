import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 5566,
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
  "name": "StraitsX",
  "nativeCurrency": {
    "name": "StraitsX Token",
    "symbol": "STX",
    "decimals": 18
  },
  "networkId": 5566,
  "redFlags": [],
  "rpc": [
    "https://5566.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-straitsx-y2550.avax.network/ext/bc/EJ4DyXHe4ydhsLLMiDPsHtoq5RDqgyao6Lwb9znKhs59q4NQx/rpc?token=1b1459649e0020ee44e60cb6ac025d67dc60e04c8a48875a3b581e2b8f797a6b"
  ],
  "shortName": "StraitsX",
  "slug": "straitsx",
  "testnet": false
} as const satisfies Chain;