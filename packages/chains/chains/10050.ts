import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10050,
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
  "name": "QR0327S1D Testnet",
  "nativeCurrency": {
    "name": "QR0327S1D Testnet Token",
    "symbol": "WZL",
    "decimals": 18
  },
  "networkId": 10050,
  "redFlags": [],
  "rpc": [
    "https://10050.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0327s1dt/testnet/rpc"
  ],
  "shortName": "QR0327S1D Testnet",
  "slug": "qr0327s1d-testnet",
  "testnet": true
} as const satisfies Chain;