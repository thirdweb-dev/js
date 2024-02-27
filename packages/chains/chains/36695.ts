import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 36695,
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
  "name": "Cohan Yolo Testnet",
  "nativeCurrency": {
    "name": "Cohan Yolo Testnet Token",
    "symbol": "KYI",
    "decimals": 18
  },
  "networkId": 36695,
  "redFlags": [],
  "rpc": [
    "https://36695.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/c033f73a-70ff-463d-b121-81b9542e11a1"
  ],
  "shortName": "Cohan Yolo Testnet",
  "slug": "cohan-yolo-testnet",
  "testnet": true
} as const satisfies Chain;