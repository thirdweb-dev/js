import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51435,
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
  "name": "QR0410s1d Testnet",
  "nativeCurrency": {
    "name": "QR0410s1d Testnet Token",
    "symbol": "CWV",
    "decimals": 18
  },
  "networkId": 51435,
  "redFlags": [],
  "rpc": [
    "https://51435.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0410s1d/testnet/rpc"
  ],
  "shortName": "QR0410s1d Testnet",
  "slug": "qr0410s1d-testnet",
  "testnet": true
} as const satisfies Chain;