import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 98557,
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
  "name": "QR0201I1",
  "nativeCurrency": {
    "name": "QR0201I1 Token",
    "symbol": "OCZ",
    "decimals": 18
  },
  "networkId": 98557,
  "redFlags": [],
  "rpc": [
    "https://qr0201i1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://98557.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0201i1/testnet/rpc"
  ],
  "shortName": "QR0201I1",
  "slug": "qr0201i1",
  "testnet": true
} as const satisfies Chain;