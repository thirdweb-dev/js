import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 79338,
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
  "name": "QR0122I1 Testnet",
  "nativeCurrency": {
    "name": "QR0122I1 Testnet Token",
    "symbol": "JVTX",
    "decimals": 18
  },
  "networkId": 79338,
  "redFlags": [],
  "rpc": [
    "https://79338.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0122i1te/testnet/rpc"
  ],
  "shortName": "QR0122I1 Testnet",
  "slug": "qr0122i1-testnet",
  "testnet": true
} as const satisfies Chain;