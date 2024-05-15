import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 27827,
  "explorers": [
    {
      "name": "ZEROONEMAI Explorer",
      "url": "https://subnets.avax.network/zeroonemai",
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
  "name": "zeroone Mainnet",
  "nativeCurrency": {
    "name": "zeroone Mainnet Token",
    "symbol": "ZERO",
    "decimals": 18
  },
  "networkId": 27827,
  "redFlags": [],
  "rpc": [
    "https://27827.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/zeroonemai/mainnet/rpc"
  ],
  "shortName": "zeroone Mainnet",
  "slug": "zeroone",
  "testnet": false
} as const satisfies Chain;