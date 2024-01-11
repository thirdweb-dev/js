import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 40798,
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
  "name": "qr0109y1p",
  "nativeCurrency": {
    "name": "qr0109y1p Token",
    "symbol": "KZP",
    "decimals": 18
  },
  "networkId": 40798,
  "redFlags": [],
  "rpc": [
    "https://qr0109y1p.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://40798.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0109y1p/testnet/rpc"
  ],
  "shortName": "qr0109y1p",
  "slug": "qr0109y1p",
  "testnet": true
} as const satisfies Chain;