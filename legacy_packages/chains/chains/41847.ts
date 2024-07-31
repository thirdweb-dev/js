import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 41847,
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
  "name": "QR0606T3TP",
  "nativeCurrency": {
    "name": "QR0606T3TP Token",
    "symbol": "HRQ",
    "decimals": 18
  },
  "networkId": 41847,
  "redFlags": [],
  "rpc": [
    "https://41847.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0606t3tp/testnet/rpc"
  ],
  "shortName": "QR0606T3TP",
  "slug": "qr0606t3tp",
  "testnet": true
} as const satisfies Chain;