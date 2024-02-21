import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 950375,
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
  "name": "QR0209Y1S",
  "nativeCurrency": {
    "name": "QR0209Y1S Token",
    "symbol": "XPU",
    "decimals": 18
  },
  "networkId": 950375,
  "redFlags": [],
  "rpc": [
    "https://950375.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0209y1s/testnet/rpc"
  ],
  "shortName": "QR0209Y1S",
  "slug": "qr0209y1s",
  "testnet": true
} as const satisfies Chain;