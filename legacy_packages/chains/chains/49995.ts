import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 49995,
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
  "name": "QR0606T2TP",
  "nativeCurrency": {
    "name": "QR0606T2TP Token",
    "symbol": "HRQ",
    "decimals": 18
  },
  "networkId": 49995,
  "redFlags": [],
  "rpc": [
    "https://49995.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0606t2tp/testnet/rpc"
  ],
  "shortName": "QR0606T2TP",
  "slug": "qr0606t2tp",
  "testnet": true
} as const satisfies Chain;