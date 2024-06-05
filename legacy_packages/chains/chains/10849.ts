import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 10849,
  "explorers": [
    {
      "name": "Lamina1 Explorer",
      "url": "https://subnets.avax.network/lamina1",
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
  "name": "Lamina1",
  "nativeCurrency": {
    "name": "Lamina1 Token",
    "symbol": "L",
    "decimals": 18
  },
  "networkId": 10849,
  "redFlags": [],
  "rpc": [
    "https://10849.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/lamina1/mainnet/rpc"
  ],
  "shortName": "Lamina1",
  "slip44": 1,
  "slug": "lamina1",
  "testnet": false
} as const satisfies Chain;