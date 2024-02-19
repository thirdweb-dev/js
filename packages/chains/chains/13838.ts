import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 13838,
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
  "name": "XTraderlands Subnet Tesnet",
  "nativeCurrency": {
    "name": "XTraderlands Subnet Tesnet Token",
    "symbol": "XTDL",
    "decimals": 18
  },
  "networkId": 13838,
  "redFlags": [],
  "rpc": [
    "https://xtraderlands-subnet-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13838.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/xtraderlan/testnet/rpc"
  ],
  "shortName": "XTraderlands Subnet Tesnet",
  "slug": "xtraderlands-subnet-tesnet",
  "testnet": true
} as const satisfies Chain;