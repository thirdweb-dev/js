import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 991424,
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
  "name": "QR0213Y1S",
  "nativeCurrency": {
    "name": "QR0213Y1S Token",
    "symbol": "GCH",
    "decimals": 18
  },
  "networkId": 991424,
  "redFlags": [],
  "rpc": [
    "https://qr0213y1s.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://991424.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0213y1s/testnet/rpc"
  ],
  "shortName": "QR0213Y1S",
  "slug": "qr0213y1s",
  "testnet": true
} as const satisfies Chain;