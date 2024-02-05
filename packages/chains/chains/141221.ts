import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 141221,
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
  "name": "Xantus Testnet",
  "nativeCurrency": {
    "name": "Xantus Testnet Token",
    "symbol": "XAN",
    "decimals": 18
  },
  "networkId": 141221,
  "redFlags": [],
  "rpc": [
    "https://xantus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://141221.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/xantustest/testnet/rpc"
  ],
  "shortName": "Xantus Testnet",
  "slug": "xantus-testnet",
  "testnet": true
} as const satisfies Chain;