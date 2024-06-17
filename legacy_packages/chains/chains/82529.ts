import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 82529,
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
  "networkId": 82529,
  "redFlags": [],
  "rpc": [
    "https://82529.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/testsize/testnet/rpc"
  ],
  "shortName": "Test Using Resources",
  "slug": "test-using-resources-test using resources",
  "testnet": true
} as const satisfies Chain;