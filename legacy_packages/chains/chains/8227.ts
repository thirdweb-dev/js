import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 8227,
  "explorers": [
    {
      "name": "SPACE Explorer",
      "url": "https://subnets.avax.network/space",
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
  "name": "Space",
  "nativeCurrency": {
    "name": "Space Token",
    "symbol": "FUEL",
    "decimals": 18
  },
  "networkId": 8227,
  "redFlags": [],
  "rpc": [
    "https://8227.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/space/mainnet/rpc"
  ],
  "shortName": "Space",
  "slug": "space",
  "testnet": false
} as const satisfies Chain;