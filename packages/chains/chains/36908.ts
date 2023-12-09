import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 36908,
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
  "name": "QR1205s1",
  "nativeCurrency": {
    "name": "QR1205s1 Token",
    "symbol": "MDN",
    "decimals": 18
  },
  "networkId": 36908,
  "redFlags": [],
  "rpc": [
    "https://qr1205s1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://36908.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr1205s1/testnet/rpc"
  ],
  "shortName": "QR1205s1",
  "slug": "qr1205s1",
  "testnet": true
} as const satisfies Chain;