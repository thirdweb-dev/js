import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 4905,
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
  "name": "Jambon's Testnet",
  "nativeCurrency": {
    "name": "Jambon's Testnet Token",
    "symbol": "XFX",
    "decimals": 18
  },
  "networkId": 4905,
  "redFlags": [],
  "rpc": [
    "https://jambon-s-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4905.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f4ceb0cc-0d11-4d49-888e-d744e333488a"
  ],
  "shortName": "Jambon's Testnet",
  "slug": "jambon-s-testnet",
  "testnet": true
} as const satisfies Chain;