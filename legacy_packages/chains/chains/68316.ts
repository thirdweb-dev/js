import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 68316,
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
  "name": "QR0611STS",
  "nativeCurrency": {
    "name": "QR0611STS Token",
    "symbol": "NAA",
    "decimals": 18
  },
  "networkId": 68316,
  "redFlags": [],
  "rpc": [
    "https://68316.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0611sts/testnet/rpc"
  ],
  "shortName": "QR0611STS",
  "slug": "qr0611sts",
  "testnet": true
} as const satisfies Chain;