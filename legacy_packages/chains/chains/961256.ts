import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 961256,
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
  "name": "QR0326T4TS Testnet",
  "nativeCurrency": {
    "name": "QR0326T4TS Testnet Token",
    "symbol": "HTF",
    "decimals": 18
  },
  "networkId": 961256,
  "redFlags": [],
  "rpc": [
    "https://961256.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0326t4ts/testnet/rpc"
  ],
  "shortName": "QR0326T4TS Testnet",
  "slug": "qr0326t4ts-testnet",
  "testnet": true
} as const satisfies Chain;