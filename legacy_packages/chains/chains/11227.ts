import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 11227,
  "explorers": [
    {
      "name": "JIRITSUTES Explorer",
      "url": "https://subnets-test.avax.network/jiritsutes",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Jiritsu Testnet",
  "nativeCurrency": {
    "name": "Jiritsu Testnet Token",
    "symbol": "TZW",
    "decimals": 18
  },
  "networkId": 11227,
  "redFlags": [],
  "rpc": [
    "https://11227.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jiritsutes/testnet/rpc"
  ],
  "shortName": "Jiritsu Testnet",
  "slug": "jiritsu-testnet",
  "testnet": true
} as const satisfies Chain;