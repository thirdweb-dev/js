import type { Chain } from "../src/types";
export default {
  "chain": "zFirst AvaCloud Subnet Thirdweb",
  "chainId": 82807,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": ".svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "zFirst AvaCloud Subnet Thirdweb",
  "nativeCurrency": {
    "name": "zFirst AvaCloud Subnet Thirdweb",
    "symbol": "YOOO",
    "decimals": 18
  },
  "networkId": 82807,
  "redFlags": [],
  "rpc": [
    "https://zfirst-avacloud-subnet-thirdweb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://82807.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avacloud-dev.io/f2ea180d-0fda-4b06-9b2e-53a65d3fd789"
  ],
  "shortName": "zFirst AvaCloud Subnet Thirdweb",
  "slug": "zfirst-avacloud-subnet-thirdweb",
  "testnet": true
} as const satisfies Chain;