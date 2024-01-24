import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 82368,
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
  "name": "QR0116S1",
  "nativeCurrency": {
    "name": "QR0116S1 Token",
    "symbol": "USJ",
    "decimals": 18
  },
  "networkId": 82368,
  "redFlags": [],
  "rpc": [
    "https://qr0116s1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://82368.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0116s1/testnet/rpc"
  ],
  "shortName": "QR0116S1",
  "slug": "qr0116s1",
  "testnet": true
} as const satisfies Chain;