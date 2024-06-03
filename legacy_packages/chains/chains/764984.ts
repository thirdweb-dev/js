import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 764984,
  "explorers": [
    {
      "name": "Lamina1 Test Explorer",
      "url": "https://subnets-test.avax.network/lamina1tes",
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
  "name": "Lamina1 Testnet",
  "nativeCurrency": {
    "name": "Lamina1 Testnet Token",
    "symbol": "L1T",
    "decimals": 18
  },
  "networkId": 764984,
  "redFlags": [],
  "rpc": [
    "https://764984.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lamina1tes/testnet/rpc"
  ],
  "shortName": "Lamina1 Testnet",
  "slip44": 1,
  "slug": "lamina1-testnet",
  "testnet": true
} as const satisfies Chain;