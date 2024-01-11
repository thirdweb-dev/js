import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 35730,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QR1129I1",
  "nativeCurrency": {
    "name": "QR1129I1 Token",
    "symbol": "YXAX",
    "decimals": 18
  },
  "networkId": 35730,
  "redFlags": [],
  "rpc": [
    "https://qr1129i1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://35730.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr1129i1/testnet/rpc"
  ],
  "shortName": "QR1129I1",
  "slug": "qr1129i1",
  "testnet": true
} as const satisfies Chain;