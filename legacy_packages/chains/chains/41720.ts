import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 41720,
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
  "name": "QR0409s1 Testnet",
  "nativeCurrency": {
    "name": "QR0409s1 Testnet Token",
    "symbol": "ZSP",
    "decimals": 18
  },
  "networkId": 41720,
  "redFlags": [],
  "rpc": [
    "https://41720.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0409s1/testnet/rpc"
  ],
  "shortName": "QR0409s1 Testnet",
  "slug": "qr0409s1-testnet",
  "testnet": true
} as const satisfies Chain;