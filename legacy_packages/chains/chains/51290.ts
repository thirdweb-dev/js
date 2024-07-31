import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 51290,
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
  "name": "Test Using Resources",
  "nativeCurrency": {
    "name": "Test Using Resources Token",
    "symbol": "JMH",
    "decimals": 18
  },
  "networkId": 51290,
  "redFlags": [],
  "rpc": [
    "https://51290.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/testsize2/testnet/rpc"
  ],
  "shortName": "Test Using Resources",
  "slug": "test-using-resources",
  "testnet": true
} as const satisfies Chain;