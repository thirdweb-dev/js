import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 86157,
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
  "name": "QR0523S1T",
  "nativeCurrency": {
    "name": "QR0523S1T Token",
    "symbol": "STZ",
    "decimals": 18
  },
  "networkId": 86157,
  "redFlags": [],
  "rpc": [
    "https://86157.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0523s1t/testnet/rpc"
  ],
  "shortName": "QR0523S1T",
  "slug": "qr0523s1t",
  "testnet": true
} as const satisfies Chain;