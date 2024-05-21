import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 25688,
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
  "name": "QR0520T1TD",
  "nativeCurrency": {
    "name": "QR0520T1TD Token",
    "symbol": "DYH",
    "decimals": 18
  },
  "networkId": 25688,
  "redFlags": [],
  "rpc": [
    "https://25688.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qr0520t1td/testnet/rpc"
  ],
  "shortName": "QR0520T1TD",
  "slug": "qr0520t1td",
  "testnet": true
} as const satisfies Chain;