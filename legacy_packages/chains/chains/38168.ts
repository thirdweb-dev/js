import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 38168,
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
  "name": "QR0531S1T",
  "nativeCurrency": {
    "name": "QR0531S1T Token",
    "symbol": "GKN",
    "decimals": 18
  },
  "networkId": 38168,
  "redFlags": [],
  "rpc": [
    "https://38168.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0531s1t/testnet/rpc"
  ],
  "shortName": "QR0531S1T",
  "slug": "qr0531s1t",
  "testnet": true
} as const satisfies Chain;