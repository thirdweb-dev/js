import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 919517,
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
  "name": "QR0508T1TP",
  "nativeCurrency": {
    "name": "QR0508T1TP Token",
    "symbol": "AHO",
    "decimals": 18
  },
  "networkId": 919517,
  "redFlags": [],
  "rpc": [
    "https://919517.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0508t1tp/testnet/rpc"
  ],
  "shortName": "QR0508T1TP",
  "slug": "qr0508t1tp",
  "testnet": true
} as const satisfies Chain;