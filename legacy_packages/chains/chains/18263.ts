import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 18263,
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
  "name": "QR0528S1T",
  "nativeCurrency": {
    "name": "QR0528S1T Token",
    "symbol": "STZ",
    "decimals": 18
  },
  "networkId": 18263,
  "redFlags": [],
  "rpc": [
    "https://18263.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0528s1t/testnet/rpc"
  ],
  "shortName": "QR0528S1T",
  "slug": "qr0528s1t",
  "testnet": true
} as const satisfies Chain;